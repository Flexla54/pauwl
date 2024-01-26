import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  RoomDto,
  APIsService,
  PlayerDto,
  CreatePlayerDto,
  AddPlayerToRoomDto,
} from '@meme-lib/api-connector';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface AppState {
  rooms: RoomDto[];
  roomsLoading: boolean;

  currentRoom?: RoomDto;
  currentRoomLoading: boolean;

  player?: PlayerDto;
  playerLoading: boolean;

  joiningRoom?: RoomDto;
}

const initialState: AppState = {
  rooms: [],
  roomsLoading: false,

  currentRoomLoading: false,

  playerLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
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
    async startGame() {
      const roomId = store.currentRoom?.()?.id;

      const test = apiService.appControllerSse(roomId!);

      if (!roomId) {
        return;
      }

      patchState(store, { currentRoomLoading: true });
    },
  }))
);

export type AppStore = InstanceType<typeof AppStore>;
