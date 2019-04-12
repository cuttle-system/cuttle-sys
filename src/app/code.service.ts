import { Injectable } from '@angular/core';
import { Code } from './code';
import {ConnectionService} from './connection.service';
import {WebsocketService} from './websocket.service';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  commonConfiguration: object = {
    theme: 'darcula',
    lineNumbers: true,
  };

  silentConfigurationCodesChangedOperation = true;
  silentTranslatedCodesChangedOperation = true;

  configurationCodesList: string[] = [];
  translatedCodesList: string[] = [];

  configurationCodes: Code[] = [
    {path: 'foo.cutl', filename: 'foo.cutl', configuration: {mode:  'javascript'}, lines: [[{
        removable: false,
        code: '0if 0get "in_class" 0eq "true" 0do\n' +
              'this.0pf_methodName0 = function (0ps_args0) {\n' +
            '    0ps_body0\n' +
            '}\n' +
            '0end\n' +
            '0else 0do\n' +
            'function 0pf_methodName0(0ps_args0) {\n' +
            '    0ps_body0\n' +
            '}\n' +
            '0end',
        codeMirror: true
      }]]
    },
    {path: 'foo.cutl.cutc', filename: 'foo.cutl.cutc', configuration: {mode:  'python'}, lines: [[{
      removable: false,
      code: '\'ecmascript\'.5 to \'cutvm-translator-output\'.1',
      codeMirror: true
    }]]},
    {path: 'foo.py.cutc', filename: 'foo.py.cutc', configuration: {mode:  'python'}, lines: [[{
      removable: false,
      code: '\'python\'.31 to \'php\'.72',
      codeMirror: true
    }]]},
  ];

  translatedCodes: Code[] = [
    // {path: 'foo.py', filename: 'foo.py', configuration: {mode:  'python'}, srcs: [{
    //   code: 'x = 1\n' +
    //         'if x == 1:\n' +
    //       '    # indented four spaces\n' +
    //       '    print("x is 1.")',
    //   codeMirror: true
    //   }]},
    // {path: 'bar.js', filename: 'bar.js', configuration: {mode:  'javascript'}, srcs: [{
    //   code: 'function findSequence(goal) {\n' +
    //         '  function find(start, history) {\n' +
    //       '    if (start == goal)\n' +
    //       '      return history;\n' +
    //       '    else if (start > goal)\n' +
    //       '      return null;\n' +
    //       '    else\n' +
    //       '      return find(start + 5, "(" + history + " + 5)") ||\n' +
    //       '             find(start * 3, "(" + history + " * 3)");\n' +
    //       '  }\n' +
    //       '  return find(1, "1");\n' +
    //       '}',
    //   codeMirror: true
    //   }]},
  ];

  currentConfigurationCode: Code = this.configurationCodes[0];
  // currentConfigurationCode: Code = null;
  currentTranslatedCode: Code = null;

  getCurrentConfigurationCodeConfig(): object {
    return {...this.commonConfiguration, ...this.currentConfigurationCode.configuration};
  }

  getCurrentTranslatedCodeConfig(): object {
    if (this.currentTranslatedCode === null) {
      return this.commonConfiguration;
    }
    return {...this.commonConfiguration, ...this.currentTranslatedCode.configuration};
  }

  setTranslatedCode(name) {
    this.websocketService.sendMessage('getFiles', {
      connectionId: this.connectionService.connectionId,
      filesList: {
        translatedFiles: [name],
        configurationFiles: []
      }
    }, json => {
      this.currentTranslatedCode = json.files.translatedFiles[0];
    });
  }

  setConfigurationCode(name) {
    // this.currentConfigurationCode =
  }

  updateCodeList(json) {
    this.configurationCodesList = json.filesList.configurationFilesList;
    this.translatedCodesList = json.filesList.translatedFilesList;
    if (this.currentConfigurationCode === null) {
      this.setConfigurationCode(this.configurationCodesList[0]);
    }
    if (this.currentTranslatedCode === null) {
       this.setTranslatedCode(this.translatedCodesList[0]);
    }
  }

  updateCodes(json) {
    console.log('updateCode: ', json);
  }

  private onConfigurationCodesChanged(currentConfigurationCode: Code) {
    if (!this.silentConfigurationCodesChangedOperation && typeof this.websocketService !== 'undefined') {
      this.websocketService.sendMessage('updateFiles', {
        connectionId: this.connectionService.connectionId,
        files: {
          configurationFiles: [
            currentConfigurationCode
          ]
        }
      }, () => {});
    } else {
      this.silentConfigurationCodesChangedOperation = false;
    }
  }

  private onTranslatedCodesChanged(currentTranslatedCode: Code) {
    if (!this.silentTranslatedCodesChangedOperation && typeof this.websocketService !== 'undefined') {
      this.websocketService.sendMessage('updateFiles', {
        connectionId: this.connectionService.connectionId,
        files: {
          translatedFiles: [
            currentTranslatedCode
          ]
        }
      }, () => {});
    } else {
      this.silentTranslatedCodesChangedOperation = false;
    }
  }

  constructor(private connectionService: ConnectionService, private websocketService: WebsocketService) {
    websocketService.onMessageReceived('getFilesList', (list) => this.updateCodeList(list));
    websocketService.onMessageReceived('getFiles', (list) => this.updateCodes(list));

    of(this.currentConfigurationCode).subscribe((code) => this.onConfigurationCodesChanged(code));
    of(this.currentTranslatedCode).subscribe((code) => this.onTranslatedCodesChanged(code));
  }
}
