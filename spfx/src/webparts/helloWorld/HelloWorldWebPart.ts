import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';

import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';

import * as AuthenticationContext from 'adal-angular';
import '../WebPartAuthenticationContext';
import * as $ from 'jquery';

export interface IHelloWorldWebPartProps {
  description: string;
}

interface IAdalConfig extends AuthenticationContext.Options {
  webPartId?: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  public render(): void {

    let apiUrl = 'https://localhost:44361/';

    const config: IAdalConfig = {
      webPartId: this.context.instanceId,
      clientId: '6fc2655e-04cd-437d-a50d-0c1a31383775',
      popUp: true,
      instance: 'https://login.microsoftonline.com/',
      tenant: '948fd9cc-9adc-40d8-851e-acefa17ab66c'
    }

    this.domElement.innerHTML = `
      <div class="${ styles.helloWorld}">
        <button id='btn-adal'>Get data from API</button>
      </div>`;

    $('#btn-adal').on('click', () => {
      let authCtx = new AuthenticationContext(config);
      (AuthenticationContext as any).prototype._singletonInstance = undefined;
      authCtx.login();

      let interval = setInterval(() => {
        if (authCtx.loginInProgress()) return;

        clearInterval(interval);

        authCtx.acquireToken(config.clientId, (error: string, token: string) => {
          if(error){
            console.error(error);
            throw error;
          }

          console.log(token);

          this.context.httpClient.fetch(`${apiUrl}api/clients`,
            HttpClient.configurations.v1, {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            .then((response: HttpClientResponse): Promise<any[]> => {
              if (response.ok) {
                return response.json();
              } else {
                return Promise.resolve(null);
              }
            })
            .then((data: any[]): void => { 
              console.log(data);
            });
        })
      }, 100);
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
