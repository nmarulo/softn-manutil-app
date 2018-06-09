const {exec} = require('child_process');
const fs = require('fs');
let fileJar = '';
let fileProperties = '';
let maxDirSearch = 5;
let elementInputFileJar;
let elementInputFileProperties;

(function () {
    elementInputFileJar = $('#form-input-file-jar');
    elementInputFileProperties = $('#form-input-file-properties');
    $('#form-create-files').on('submit', function (event) {
        event.preventDefault();
        $(this).addClass('was-validated');
        isFormValidity($(this));
    });
    setPathJarProperties(__dirname);
})();

function isFormValidity(elementForm) {
    if (!elementForm.get(0).checkValidity()) {
        return;
    }

    let fileJar = elementInputFileJar.val();
    let fileProperties = elementInputFileProperties.val();
    let fileNameClass = elementForm.find('#form-input-name-class').val();
    let directoryNameModule = elementForm.find('#form-input-name-module').val();
    let cli = 'java -jar ' + fileJar + ' -p ' + fileProperties + ' -c ' + fileNameClass;

    if (directoryNameModule.length > 0) {
        cli += ' -m ' + directoryNameModule;
    }

    exec(cli, (err, stdout, stderr) => {
        $('#modal-information-console-java .modal-body .custom-pre').text(stdout);
        $('#modal-information-console-java').modal('show');

        if (err) {
            return;
        }
    });
}

function setPathJarProperties(path) {
    if (maxDirSearch === 0) {
        return;
    }


    fs.readdir(path, (err, files) => {
        --maxDirSearch;

        if (err) {
            return;
        }

        let fileJarFilter = files.filter(file => 'jar' === file.split('.').pop())
            .toString();
        let filePropertiesFilter = files.filter(file => 'properties' === file.split('.').pop())
            .toString();

        if (fileJarFilter.length === 0 || filePropertiesFilter.length === 0) {
            setPathJarProperties(path + '/..');
        } else {
            fileJar = path + '/' + fileJarFilter;
            fileProperties = path + '/' + filePropertiesFilter;
        }

        if (maxDirSearch > 1) {
            return;
        }

        if (fileJar.length === 0 || filePropertiesFilter.length === 0) {
            $('#modal-file-jar-properties').modal('toggle');
            elementInputFileJar.closest('.form-group').removeClass('d-none');
            elementInputFileJar.attr('type', 'text');
            elementInputFileProperties.closest('.form-group').removeClass('d-none');
            elementInputFileProperties.attr('type', 'text');
        } else {
            elementInputFileJar.val(fileJar);
            elementInputFileProperties.val(fileProperties);
        }
    });
}