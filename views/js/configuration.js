const common = require('./common');
const fs = require('fs');

let inputFileJarPath;
let inputFilePropertiesPath;
let inputFile;
let callbackInputFile;
let inputDirectoryTemplate;

(function () {
    inputFile = $('<input type="file"/>');
    inputFileJarPath = $(document).find('#input-file-jar-path');
    inputFilePropertiesPath = $(document).find('#input-file-properties-path');
    inputDirectoryTemplate = $(document).find('#input-directory-template');

    $(document).on('click', '#btn-select-jar-file', function () {
        openFileDialog(inputFileJarPath);
    });
    $(document).on('click', '#btn-select-properties-file', function () {
        openFileDialog(inputFilePropertiesPath);
    });
    inputFile.on('change', function () {
        if (callbackInputFile !== undefined) {
            callbackInputFile($(this));
        }
    });
    $(document).on('submit', '#form-edit-configuration', function (event) {
        event.preventDefault();
        let form = $(this);

        if (common.checkFormValidity(form)) {
            let configJson = common.getFormObject(form);
            common.removeClassWasValidated(form);

            fs.writeFile(common.getManutilConfigFilePath(), JSON.stringify(configJson), (err) => {
                let message = 'Actualizado correctamente.';

                if (err) {
                    message = 'Error al actualizar la configuración.\n' + err;
                }

                common.modalInformation(message);
            });
        }
    });

    inputFilePropertiesPath.val(common.getFilePropertiesPath());
    inputFileJarPath.val(common.getFileJarPath());
    inputDirectoryTemplate.val(common.getDirectoryTemplatePath());
})();

function openFileDialog(inputElement) {
    inputFile.click();
    callbackInputFile = function (inputFile) {
        inputElement.val(inputFile.get(0).files[0].path);
    }
}