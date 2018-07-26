var inputProjectModules;
var formAddModule;
var navAddModuleData;

(function () {
    formAddModule = $(document).find('#modal-form-add-module');
    inputProjectModules = $(document).find('#input-project-modules');
    navAddModuleData = $(document).find('#nav-add-module-data');
    $(document).on('click', '#modal-btn-add', function () {
        btnAddFormAddModule();
    });
    $(document).on('click', '#modal-btn-edit', function () {
        btnEditFormAddModule($(document).find('#input-project-module-id'));
    });
    $(document).on('click', '.modal-btn-replace-delete', function () {
        $(this).closest('.form-group').remove();
    });
    $(document).on('click', '#modal-btn-replace-add', function () {
        var lastInput = navAddModuleData.find('.form-group > input[type=hidden]:last');
        var pos = 1;

        if (lastInput.length === 1) {
            pos = parseInt(lastInput.val()) + 1;
        }

        navAddModuleData.append(getTemplateReplaceHtml(pos));
    });
    $('#modal-add-module').on('show.bs.modal', function () {
        formAddModule.get(0).reset();
        navAddModuleData.find('.form-group').each(function () {
            if ($(this).find('input[type=hidden]').length > 0) {
                $(this).remove();
            }
        });
        $('a[href*=nav-add-module-general]').click();
    });
})();

function getTemplateReplaceHtml(pos) {
    //TODO: mover a una plantilla.
    return '<div class="form-group">\n' +
        '<input type="hidden" value="' + pos + '"/>\n' +
        '<div class="input-group mb-3">\n' +
        '<div class="input-group-prepend">\n' +
        '<span class="input-group-text">%' + pos + '$s</span>\n' +
        '</div>\n' +
        '<input class="form-control" type="text" placeholder="Test001">\n' +
        '<div class="input-group-append">\n' +
        '<button class="btn btn-danger modal-btn-replace-delete" type="button">\n' +
        'Eliminar\n' +
        '</button>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>';
}

function btnEditFormAddModule(projectModuleId) {
    var moduleObjects = getModuleObjects();
    var moduleObj = getFormAddModuleObj();

    for (var i = 0, len = moduleObjects.length; i < len; i++) {
        if (moduleObjects[i]["projectModuleId"] == projectModuleId) {
            moduleObjects[i] = moduleObj;
            break;
        }
    }

    updateProjectModules(moduleObjects);
}

function btnAddFormAddModule() {
    var moduleObjects = getModuleObjects();
    var moduleObj = getFormAddModuleObj();
    var id = 1;

    if (moduleObjects.length > 0) {
        var lastModule = moduleObjects[moduleObjects.length - 1];
        id = parseInt(lastModule["projectModuleId"]) + 1;
    }

    moduleObj["projectModuleId"] = id;

    updateProjectModules(moduleObjects.concat(moduleObj));
}

function getModuleObjects() {
    var modules = inputProjectModules.val();
    var moduleObjects = [];

    if (modules.length > 0) {
        moduleObjects = JSON.parse(modules);
    }

    return moduleObjects;
}

function updateProjectModules(moduleObjects) {
    inputProjectModules.val(JSON.stringify(moduleObjects));
}

function getFormAddModuleObj() {
    updateTemplateReplace();

    var moduleObj = {};
    var modalFormSerialize = formAddModule.serializeArray();

    for (var i = 0, len = modalFormSerialize.length; i < len; i++) {
        var name = modalFormSerialize[i]["name"];
        var value = modalFormSerialize[i]["value"];

        moduleObj[name] = value;
    }

    return moduleObj;
}

function updateTemplateReplace() {
    var inputTemplateReplace = formAddModule.find('#input-project-classes-template-replace');
    var replaceObj = {};

    navAddModuleData.find('.form-group').each(function () {
        var inputHidden = $(this).find('input[type=hidden]');
        var inputText = $(this).find('input[type=text]');

        if (inputHidden.length > 0 && inputText.length > 0) {
            replaceObj[inputHidden.val()] = inputText.val()
        }
    });

    inputTemplateReplace.val(JSON.stringify(replaceObj));
}