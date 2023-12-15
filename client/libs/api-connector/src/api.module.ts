import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { ApiConnectorConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';


@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiConnectorApiModule {
    public static forRoot(configurationFactory: () => ApiConnectorConfiguration): ModuleWithProviders<ApiConnectorApiModule> {
        return {
            ngModule: ApiConnectorApiModule,
            providers: [ { provide: ApiConnectorConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiConnectorApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiConnectorApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
