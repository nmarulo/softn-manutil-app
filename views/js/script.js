const {exec} = require('child_process');
const fs = require('fs');
const properties = require("properties");
const KEY_PROJECT_MODULES = 'project.modules.';
const KEY_PROJECT_MODULE_FORMAT_SEPARATOR = 'project.module.format.separator';

let fileJar = '';
let fileProperties = '';
let maxDirSearch;
let maxDirSearchJSON;
let elementInputFileJar;
let elementInputFileProperties;
let elementInputNameModule;
let elementProjectVersion;

(function () {
    initVars();
    initEvents();
    setPathJarProperties(__dirname);
    getVersion(__dirname);
})();

function initVars() {
    elementInputFileJar = $('#form-input-file-jar');
    elementInputFileProperties = $('#form-input-file-properties');
    elementInputNameModule = $('#form-input-name-module');
    elementProjectVersion = document.getElementById('project-version');
    maxDirSearchJSON = 5;
    maxDirSearch = 5;
}

function initEvents() {
    $('#form-create-files').on('submit', function (event) {
        event.preventDefault();
        $(this).addClass('was-validated');
        isFormValidity($(this));
    });
    elementInputFileProperties.on('focusout', function () {
        setSelectNameModule($(this).val());
    });
}

function isFormValidity(elementForm) {
    if (!elementForm.get(0).checkValidity()) {
        return;
    }

    execJava(elementForm);
}

function execJava(elementForm) {
    let fileJar = elementInputFileJar.val();
    let fileProperties = elementInputFileProperties.val();
    let fileNameClass = elementForm.find('#form-input-name-class').val();
    let directoryNameModule = elementInputNameModule.val();
    let cli = 'java -jar ' + fileJar + ' -p ' + fileProperties + ' -c ' + fileNameClass;

    if (directoryNameModule.length > 0 && !directoryNameModule.some(value => value === '')) {
        cli += ' -m ' + directoryNameModule.join(',');
    }

    exec(cli, (err, stdout, stderr) => {
        modalInformation(stdout);

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

        let fileJarFilter = getFileNameByExt(files, 'jar');
        let filePropertiesFilter = getFileNameByExt(files, 'properties');

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
            setSelectNameModule(fileProperties);
        }
    });
}

function getFileNameByExt(files, search) {
    let filter = files.filter(file => search === file.split('.').pop());

    if(filter.length > 0){
        return filter.shift();
    }

    return '';
}

function setSelectNameModule(fileName) {
    properties.parse(fileName, {path: true}, function (error, obj) {
        if (error) {
            modalInformation('Error al obtener los modulos del fichero ".properties".');

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
    });
}

function someValueNameModule(option) {
    return $.makeArray(elementInputNameModule.find('option'))
        .map(value => value.innerText)
        .some(value => value === option);
}

function modalInformation(message) {
    $('#modal-information .modal-body .custom-pre').text(message);
    $('#modal-information').modal('show');
}

function getVersion(path) {
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
            getVersion(path + '/..');
        } else {
            fs.readFile(path + '/' + fileJSONFilter, 'utf8', (error, data) => {
                if (error) {
                    modalInformation("Error al obtener la versión de la app.");

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