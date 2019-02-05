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

  silentOperation = false;

  configurationCodesList: string[] = [];
  translatedCodesList: string[] = [];

  configurationCodes: Code[] = [
    {path: 'foo.cutl', filename: 'foo.cutl', configuration: {mode:  'javascript'}, srcs: [{
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
      }]
    },
    {path: 'foo.cutl.cutc', filename: 'foo.cutl.cutc', configuration: {mode:  'python'}, srcs: [{
      code: '\'ecmascript\'.5 to \'cutvm-translator-output\'.1',
      codeMirror: true
    }]},
    {path: 'foo.py.cutc', filename: 'foo.py.cutc', configuration: {mode:  'python'}, srcs: [{
      code: '\'python\'.31 to \'php\'.72',
      codeMirror: true
    }]},
  ];

  translatedCodes: Code[] = [
    {path: 'foo.py', filename: 'foo.py', configuration: {mode:  'python'}, srcs: [{
      code: 'x = 1\n' +
            'if x == 1:\n' +
          '    # indented four spaces\n' +
          '    print("x is 1.")',
      codeMirror: true
      }]},
    {path: 'bar.js', filename: 'bar.js', configuration: {mode:  'javascript'}, srcs: [{
      code: 'function findSequence(goal) {\n' +
            '  function find(start, history) {\n' +
          '    if (start == goal)\n' +
          '      return history;\n' +
          '    else if (start > goal)\n' +
          '      return null;\n' +
          '    else\n' +
          '      return find(start + 5, "(" + history + " + 5)") ||\n' +
          '             find(start * 3, "(" + history + " * 3)");\n' +
          '  }\n' +
          '  return find(1, "1");\n' +
          '}',
      codeMirror: true
      }]},
  ];

  currentConfigurationCode: Code = this.configurationCodes[0];
  currentTranslatedCode: Code = this.translatedCodes[0];

  getCurrentConfigurationCodeConfig(): object {
    return {...this.commonConfiguration, ...this.currentConfigurationCode.configuration};
  }

  getCurrentTranslatedCodeConfig(): object {
    return {...this.commonConfiguration, ...this.currentTranslatedCode.configuration};
  }

  updateCodeList(json) {
    console.log('updateCodeList');
    console.log(json);
    this.configurationCodesList = json.filesList.configurationFilesList;
    this.translatedCodesList = json.filesList.translatedFilesList;
  }

  updateCodes(json) {
    console.log('updateCode');
    console.log(json);
  }

  private onConfigurationCodesChanged(currentConfigurationCode: Code) {
    if (!this.silentOperation && typeof this.websocketService !== 'undefined') {
      this.websocketService.sendMessage('updateFiles', {
        files: {
          configurationFiles: [
            currentConfigurationCode
          ]
        }
      }, () => {});
    } else {
      this.silentOperation = false;
    }
  }

  private onTranslatedCodesChanged(translatedCodes: Code) {
    if (!this.silentOperation && typeof this.websocketService !== 'undefined') {
      this.websocketService.sendMessage('updateFiles', {
        files: {
          translatedFiles: [
            translatedCodes
          ]
        }
      }, () => {});
    } else {
      this.silentOperation = false;
    }
  }

  constructor(private connectionService: ConnectionService, private websocketService: WebsocketService) {
    websocketService.onMessageRecieved('getFilesList', this.updateCodeList);
    websocketService.onMessageRecieved('getFiles', this.updateCodes);

    of(this.currentConfigurationCode).subscribe(this.onConfigurationCodesChanged);
    of(this.currentTranslatedCode).subscribe(this.onTranslatedCodesChanged);
  }
}
