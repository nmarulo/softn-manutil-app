const common = require('./common');
const properties = require("properties");
const KEY_PROJECT_MODULES = 'project.modules.';
const KEY_PROJECT_MODULE_FORMAT_SEPARATOR = 'project.module.format.separator';

let elementInputNameModule;

(function () {
    elementInputNameModule = $('#input-name-module');
    $('#form-create-files').on('submit', function (event) {
        event.preventDefault();
        let form = $(this);

        if (common.checkFormValidity(form)) {
            common.removeClassWasValidated(form);
            formCreateFiles(form);
        }
    });
    setSelectNameModule(common.getFilePropertiesPath());
})();

function formCreateFiles(elementForm) {
    let fileNameClass = elementForm.find('#input-name-class').val();
    let directoryNameModule = elementInputNameModule.val();
    let cli = '--create-classes -p "' + common.getFilePropertiesPath() + '" -c ' + fileNameClass;

    if (directoryNameModule.length > 0 && !directoryNameModule.some(value => value === '')) {
        cli += ' -m ' + directoryNameModule.join(',');
    }

    common.execJava(cli, function (stdout) {
        common.modalInformation(stdout);
    });
}

function setSelectNameModule(fileName) {
    properties.parse(fileName, {path: true}, function (error, obj) {
        if (error) {
            common.modalInformation('Error al obtener los módulos del fichero ".properties".\n' + error);

            return;
        }

        let separator = obj[KEY_PROJECT_MODULE_FORMAT_SEPARATOR];

        Object.keys(obj)
            .filter(key => key.startsWith(KEY_PROJECT_MODULES))
            .map(key => obj[key])
            .map(value => value.split(separator).shift())
            .forEach(value => {
                if (!someValueNameModule(value)) {
                    elementInputNameModule.append('<option>' + value + '</option>');
                }
            });

        if (elementInputNameModule.find('option').length === 1) {
            common.modalInformation('No se encontraron módulos.');
        }
    });
}

function someValueNameModule(option) {
    return $.makeArray(elementInputNameModule.find('option'))
        .map(value => value.innerText)
        .some(value => value === option);
}