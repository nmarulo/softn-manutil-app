const {exec} = require('child_process');
const fs = require('fs');

let maxDirSearch;
let elementProjectVersion;

(function () {
    maxDirSearch = 5;
    elementProjectVersion = document.getElementById('project-version');
    getAndSetVersion(__dirname);
})();

function getAndSetVersion(path) {
    if (maxDirSearch === 0) {
        return;
    }

    fs.readdir(path, (err, files) => {
        --maxDirSearch;

        if (err) {
            return;
        }

        let fileJSONFilter = files.filter(value => value === 'package.json').toString();

        if (fileJSONFilter.length === 0) {
            getAndSetVersion(path + '/..');
        } else {
            fs.readFile(path + '/' + fileJSONFilter, 'utf8', (error, data) => {
                if (error) {
                    //TODO: como llamar a "module.exports.modalInformation"?
                    $('#modal-information .modal-body .custom-pre').text('Error al obtener la versión de la app.\n' + error);
                    $('#modal-information').modal('show');

                    return;
                }

                elementProjectVersion.innerText = 'v' + JSON.parse(data).version;
            });
        }

        if (maxDirSearch > 1) {
            return;
        }
    });
}

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