import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  RoomDto,
  APIsService,
  PlayerDto,
  CreatePlayerDto,
  AddPlayerToRoomDto,
  CreateRoomDto,
  BASE_PATH,
} from '@meme-lib/api-connector';
import { computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { state } from '@angular/animations';

const BASE_URL = '<something>';

interface AppState {
  rooms: RoomDto[];
  roomsLoading: boolean;

  currentRoom: RoomDto | undefined;
  currentRoomLoading: boolean;

  player: PlayerDto | undefined;
  playerLoading: boolean;

  joiningRoom: RoomDto | undefined;

  roomStream: EventSource | undefined;
}

const initialState: AppState = {
  rooms: [],
  roomsLoading: false,

  currentRoom: undefined,
  currentRoomLoading: false,

  player: undefined,
  playerLoading: false,

  joiningRoom: undefined,

  roomStream: undefined,
};

const getCurrentRoundId = (room: RoomDto | undefined) => {
  const numberOfParticipants = room?.players?.length ?? 1;

  return room?.rounds.findIndex((r) => {
    return (r.answers?.length ?? 0) < numberOfParticipants;
  });
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ rooms, currentRoom, player }) => ({
    waitingRooms: computed(() => rooms().filter((r) => r.status === 'WAITING')),
    currentRoundId: computed(() => getCurrentRoundId(currentRoom())),
    currentRound: computed(() => {
      const currentRoundId = getCurrentRoundId(currentRoom());

      return currentRoundId === undefined
        ? undefined
        : currentRoom()?.rounds[currentRoundId];
    }),
    submittedAnswerForCurrentRound: computed(() => {
      const currentRoundId = getCurrentRoundId(currentRoom());

      return currentRoundId === undefined
        ? true
        : currentRoom()?.rounds[currentRoundId].answers?.some(
            (a) => a.playerId === player()?.id
          ) ?? true;
    }),
    previousRound: computed(() => {
      let currentRoundId = getCurrentRoundId(currentRoom());

      if (currentRoundId == -1) {
        currentRoundId = (currentRoom()?.numberOfRounds ?? 4) ;
      }

      if (!currentRoundId) {
        return undefined;
      }

      return currentRoom()?.rounds[currentRoundId - 1];
    }),
    allVoted: computed(() => {
      const currentRoundId = getCurrentRoundId(currentRoom());

      if (!currentRoundId) {
        return true;
      }

      const previousRound = currentRoom()?.rounds[currentRoundId - 1];

      return (
        previousRound?.answers?.reduce((p, c) => p + c.score, 0) ==
          currentRoom()?.players?.length ?? true
      );
    }),
  })),
  withMethods((store, apiService = inject(APIsService)) => ({
    saveJoiningRoom(room: RoomDto) {
      patchState(store, { joiningRoom: room });
    },
    async loadRooms() {
      patchState(store, (state) => ({
        roomsLoading: true,
      }));

      const rooms = await firstValueFrom(apiService.appControllerGetAllRooms());

      patchState(store, {
        rooms: [...rooms],
        roomsLoading: false,
      });
    },
    async createPlayer(dto: CreatePlayerDto) {
      patchState(store, { playerLoading: true });

      const response = await firstValueFrom(
        apiService.appControllerCreatePlayer(dto)
      );

      patchState(store, { player: response, playerLoading: false });
    },
    async createRoom(dto: CreateRoomDto) {
      patchState(store, { currentRoomLoading: true });

      const response = await firstValueFrom(
        apiService.appControllerCreateRoom(dto)
      );

      patchState(store, {
        currentRoomLoading: false,
        currentRoom: response,
        rooms: [...store.rooms(), response],
      });
    },
    async joinRoom(dto: AddPlayerToRoomDto) {
      patchState(store, { currentRoomLoading: true });

      const response = await firstValueFrom(
        apiService.appControllerAddPlayer(dto)
      );

      patchState(store, {
        currentRoom: response,
        currentRoomLoading: false,
        joiningRoom: undefined,
      });
    },
    async streamUpdates() {
      if (store.roomStream() !== undefined) {
        return;
      }

      const roomId = store.currentRoom()?.id;

      if (!roomId) {
        return;
      }

      const eventSource = new EventSource(
        `${BASE_URL}/api/sse?roomId=${roomId}`
      );

      eventSource.onmessage = (event) => {
        const jsonData = JSON.parse(event.data) as RoomDto;

        patchState(store, { currentRoom: jsonData });
      };

      eventSource.onerror = () => {
        console.error('The live connection to the server was aborted!');
        patchState(store, { roomStream: undefined });
      };

      patchState(store, { roomStream: eventSource });
    },
    async startGame() {
      const roomId = store.currentRoom()?.id;

      if (roomId) {
        await firstValueFrom(apiService.appControllerStartGame({ roomId }));
      }
    },
    async submitAnswer(caption: string) {
      const playerId = store.player()?.id;
      const roomId = store.currentRoom()?.id;
      const roundId = store.currentRoundId();

      if (
        playerId == undefined ||
        roomId == undefined ||
        roundId == undefined
      ) {
        return;
      }

      await firstValueFrom(
        apiService.appControllerSubmitAnswer({
          answer: caption,
          playerId,
          roomId,
          round: roundId,
        })
      );
    },
    async submitVote(answerId: string) {
      const roomId = store.currentRoom()?.id;

      if (roomId == undefined) {
        return;
      }

      await firstValueFrom(
        apiService.appControllerVoteAnswer({
          answerId,
          roomId,
        })
      );
    },
  }))
);

export type AppStore = InstanceType<typeof AppStore>;
