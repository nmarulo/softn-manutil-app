const {exec} = require('child_process');
const fs = require('fs');

module.exports = {
    resetElementForm: function (elementForm) {
        this.removeClassWasValidated(elementForm);
        elementForm.get(0).reset();
        elementForm.find('input').removeAttr('disabled');
    },
    checkFormValidity: function (elementForm) {
        elementForm.addClass('was-validated');

        return elementForm.get(0).checkValidity();
    },
    removeClassWasValidated: function (element) {
        element.removeClass('was-validated');
    },
    getFormObject: function (elementForm) {
        let obj = {};
        let serialize = elementForm.serializeArray();

        for (let i = 0, len = serialize.length; i < len; i++) {
            let name = serialize[i]["name"];
            obj[name] = serialize[i]["value"];
        }

        return obj;
    },
    execJava: function (cli, callback) {
        let jar = this.getFileJarPath();
        cli = 'java -jar "' + jar + '" ' + cli;

        exec(cli, (err, stdout, stderr) => {
            if (err) {
                return;
            }

            if (callback !== undefined) {
                callback(stdout);
            }
        });
    },
    modalInformation: function (message) {
        $('#modal-information .modal-body .custom-pre').text(message);
        $('#modal-information').modal('show');
    },
    getFileJarPath: function () {
        return this.getManutilConfig()['fileJarPath'];
    },
    getDirectoryTemplatePath: function () {
        return this.getManutilConfig()['directoryTemplatePath'];
    },
    getFilePropertiesPath: function () {
        return this.getManutilConfig()['filePropertiesPath'];
    },
    getManutilConfig: function () {
        return JSON.parse(fs.readFileSync(this.getManutilConfigFilePath(), 'utf8'));
    },
    getManutilConfigFilePath: function () {
        return __dirname + '/../../softn-manutil-config.json';
    }
};