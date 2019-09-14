'use babel';

import { CompositeDisposable } from 'atom';

export default {
    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.commands.add('.tree-view .file', {
            'quicklaunch:run': ({target}) => this.run(target)
        }));

        this.subscriptions.add(atom.commands.add('atom-text-editor', {
            'quicklaunch:run_active': () => this.run_active()
        }));
    },

    run(target = undefined) {
        if (typeof target != "undefined") {
            //console.log(JSON.stringify(target));
            if (typeof target.dataset.path != "undefined") {
                // Sometimes this is the path to the file
                this.run_path(target.dataset.path);
            } else {
                if (typeof target.file.realPath != "undefined") {
                    // Sometimes it's this. Who knows why ¯\_(ツ)_/¯
                    this.run_path(target.file.realPath);
                } else {
                    console.log('No path found!');
                    atom.notifications.addError('No path found!');
                }
            }
        } else {
            console.log('No target found!');
            atom.notifications.addError('No target found!');
        }
    },

    run_active() {
        textEditor = atom.workspace.getActiveTextEditor()
        if (typeof textEditor != "undefined") {
            this.run_path(textEditor.getPath());
        } else {
            console.log("No active text-editor found!");
            atom.notifications.addError("No active text-editor found!");
        }
    },

    run_path(path) {
        console.log(`Launching: '${path}'...`);
        atom.notifications.addInfo(`Launching: '${path}'...`);
        try {
            //const { spawn } = require('child_process');
            //const bat = spawn('cmd.exe', ['/C', `start "${path}"`]);
            const { exec } = require('child_process');
            exec(`start cmd /C "${path}"`)

            console.log('Quicklaunch successful.');
            atom.notifications.addSuccess('Quicklaunch successful.');
        }
        catch (e) {
            console.log(e);
            atom.notifications.addError(e);
        }
    }
};
