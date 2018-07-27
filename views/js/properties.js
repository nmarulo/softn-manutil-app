var inputProjectModules;
var formAddModule;
var navAddModuleData;
var inputProjectModuleId;
var inputTemplateReplace;

(function () {
    formAddModule = $(document).find('#modal-form-add-module');
    inputProjectModules = $(document).find('#input-project-modules');
    navAddModuleData = $(document).find('#nav-add-module-data');
    inputProjectModuleId = formAddModule.find('#input-project-module-id');
    inputTemplateReplace = formAddModule.find('#input-project-classes-template-replace');

    $(document).on('click', '#modal-btn-add', function () {
        btnAddFormAddModule();
    });
    $(document).on('click', '#modal-btn-edit', function () {
        btnEditFormAddModule(inputProjectModuleId.val());
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

        addModuleDataReplace(pos);
    });
    $('#modal-add-module').on('show.bs.modal', function (event) {
        resetFormAddModule();

        var moduleId = $(event.relatedTarget).data('project-module-id');

        if (moduleId !== undefined) {
            fillFormAddModule(moduleId);
        }
    });
})();

function addModuleDataReplace(pos, callback) {
    var html = getTemplateReplaceHtml(pos);

    if (callback !== undefined) {
        html = callback(getTemplateReplaceHtml(pos));
    }

    navAddModuleData.append(html);
}

function fillFormAddModule(moduleId) {
    var moduleObj = getModuleObjectById(moduleId);
    var templateReplaceStr = moduleObj['projectClassesTemplateReplace'];
    var templateReplaceObj = JSON.parse(templateReplaceStr);

    inputProjectModuleId.val(moduleId);
    formAddModule.find('#input-project-module-name').val(moduleObj['projectModuleName']);
    formAddModule.find('#input-project-class-template-name').val(moduleObj['projectClassesTemplateName']);
    formAddModule.find('#input-project-module-package').val(moduleObj['projectModulePackage']);
    formAddModule.find('#input-project-class-template-path').val(moduleObj['projectClassesTemplatePath']);
    formAddModule.find('#input-project-class-template-type').val(moduleObj['projectClassesTemplateType']);
    inputTemplateReplace.val(templateReplaceStr);

    Object.keys(templateReplaceObj).forEach(function (key) {
        addModuleDataReplace(key, function (html) {
            var element = $(html);

            element.find('input[type=text]').val(templateReplaceObj[key]);

            return element.html();
        });
    });
}

function getModuleObjectById(id) {
    var moduleObjects = getModuleObjects();
    var moduleObj = {};

    for (var i = 0, len = moduleObjects.length; i < len; i++) {
        if (checkModuleId(moduleObjects[i], id)) {
            moduleObj = moduleObjects[i];
            break;
        }
    }

    return moduleObj;
}

function resetFormAddModule() {
    formAddModule.get(0).reset();
    navAddModuleData.find('.form-group').each(function () {
        if ($(this).find('input[type=hidden]').length > 0) {
            $(this).remove();
        }
    });
    $('a[href*=nav-add-module-general]').click();
}

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
        if (checkModuleId(moduleObjects[i], projectModuleId)) {
            moduleObjects[i] = moduleObj;
            break;
        }
    }

    updateProjectModules(moduleObjects);
}

function checkModuleId(moduleObject, moduleId) {
    return moduleObject["projectModuleId"] == moduleId;
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