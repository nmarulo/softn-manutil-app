var inputProjectModules;
var formAddModule;
var navAddModuleData;
var inputProjectModuleId;
var inputTemplateReplace;
var modalAddModule;
var modalAddModuleTitle;
var modalBtnAdd;
var modalBtnEdit;
var modalBtnDelete;

(function () {
    modalAddModule = $(document).find('#modal-add-module');
    formAddModule = $(document).find('#modal-form-add-module');
    inputProjectModules = $(document).find('#input-project-modules');
    navAddModuleData = $(document).find('#nav-add-module-data');
    inputProjectModuleId = formAddModule.find('#input-project-module-id');
    inputTemplateReplace = formAddModule.find('#input-project-classes-template-replace');
    modalAddModuleTitle = modalAddModule.find('.modal-title');
    modalBtnAdd = modalAddModule.find('#modal-btn-add');
    modalBtnEdit = modalAddModule.find('#modal-btn-edit');
    modalBtnDelete = modalAddModule.find('#modal-btn-delete');

    $(document).on('click', '#modal-btn-add', function () {
        if (checkFormValidity(formAddModule)) {
            btnAddFormAddModule();
            modalAddModule.modal('hide');
        }
    });
    $(document).on('click', '#modal-btn-edit', function () {
        if (checkFormValidity(formAddModule)) {
            btnEditFormAddModule(inputProjectModuleId.val());
            modalAddModule.modal('hide');
        }
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

        appendHtmlTemplateReplace(pos);
    });
    $('#modal-add-module').on('show.bs.modal', function (event) {
        var moduleId = $(event.relatedTarget).data('project-module-id');
        var modalTitle = 'Nuevo modulo';

        resetFormAddModule();

        if (moduleId !== undefined) {
            modalTitle = 'Editar modulo';
            fillFormAddModule(moduleId);
            removeClassDNone(modalBtnEdit);
            removeClassDNone(modalBtnDelete);
        } else {
            removeClassDNone(modalBtnAdd);
        }

        modalAddModuleTitle.text(modalTitle);
    });
})();

function removeClassDNone(elementBtn) {
    elementBtn.removeClass('d-none');
}

function appendHtmlTemplateReplace(pos, callback) {
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
    var inputModuleName = formAddModule.find('#input-project-module-name');

    inputProjectModuleId.val(moduleId);
    inputModuleName.val(moduleObj['projectModuleName']);
    inputModuleName.attr('disabled', 'disabled');
    formAddModule.find('#input-project-class-template-name').val(moduleObj['projectClassesTemplateName']);
    formAddModule.find('#input-project-module-package').val(moduleObj['projectModulePackage']);
    formAddModule.find('#input-project-class-template-path').val(moduleObj['projectClassesTemplatePath']);
    formAddModule.find('#input-project-class-template-type').val(moduleObj['projectClassesTemplateType']);
    inputTemplateReplace.val(templateReplaceStr);

    Object.keys(templateReplaceObj).forEach(function (key) {
        appendHtmlTemplateReplace(key, function (html) {
            var element = $('<div></div>').append(html);

            element.find('input[type=text]').attr('value', templateReplaceObj[key]);

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

function addClassDNoneModalAddModule() {
    addClassDNone(modalBtnAdd);
    addClassDNone(modalBtnEdit);
    addClassDNone(modalBtnDelete);
}

function addClassDNone(elementBtn) {
    elementBtn.addClass('d-none');
}

function resetFormAddModule() {
    resetElementForm(formAddModule);
    addClassDNoneModalAddModule();

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

function getNewModuleHtml(moduleName) {
    //TODO: mover a una plantilla.
    return '<div id="collapse-' + moduleName + '" class="list-group-item d-flex justify-content-between align-items-center"\n' +
        '     data-toggle="collapse" data-target="#' + moduleName + '">\n' +
        '    <span class="span-module-name">' + moduleName + '</span>\n' +
        '    <span class="badge badge-primary badge-pill">1</span>\n' +
        '</div>\n' +
        '<div id="' + moduleName + '" class="collapse" data-parent="#container-accordion-modules">\n' +
        '    <ul class="list-group list-group-flush">\n' +
        '    </ul>\n' +
        '</div>';
}

function getNewModulePackageHtml(packageName, moduleId) {
    //TODO: mover a una plantilla.
    return '<li class="list-group-item">\n' +
        '    <a href="#modal-add-module" data-toggle="modal" class="text-primary"\n' +
        '       data-project-module-id="' + moduleId + '">\n' +
        '        ' + packageName + '\n' +
        '    </a>\n' +
        '</li>';
}

function btnEditFormAddModule(projectModuleId) {
    var moduleObjects = getModuleObjects();
    var moduleObj = getFormAddModuleObj();

    for (var i = 0, len = moduleObjects.length; i < len; i++) {
        if (checkModuleId(moduleObjects[i], projectModuleId)) {
            moduleObj['projectModuleName'] = moduleObjects[i]['projectModuleName'];
            moduleObjects[i] = moduleObj;
            break;
        }
    }

    updateHtmlModulesList(moduleObjects, moduleObj, false);
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

    updateHtmlModulesList(moduleObjects, moduleObj, true);
    updateProjectModules(moduleObjects.concat(moduleObj));
}

function updateHtmlModulesList(moduleObjects, moduleObj, addNew) {
    var containerModules = $(document).find('#container-accordion-modules');
    var moduleName = moduleObj['projectModuleName'];
    var modulePackage = moduleObj['projectModulePackage'];
    var moduleId = moduleObj['projectModuleId']
    var newModule = $('<div></div>').append(getNewModuleHtml(moduleName));
    var newPackage = getNewModulePackageHtml(modulePackage, moduleId);

    moduleObjects = moduleObjects.filter(function (value) {
        return value['projectModuleName'] == moduleName;
    });

    if (moduleObjects.length > 0) {
        //Se le suma 1, ya que aun no se ha agregado el nuevo modulo a la lista.
        containerModules.find('div[id=collapse-' + moduleName + '] span.badge').text(moduleObjects.length + 1);

        if (addNew) {
            containerModules.find('div[id=' + moduleName + '] > ul.list-group').append(newPackage);
        } else {
            containerModules.find('div[id=' + moduleName + '] > ul.list-group > li.list-group-item > a[data-project-module-id=' + moduleId + ']').text(modulePackage);
        }
    } else {
        newModule.find('div > ul.list-group').append(newPackage);
        $(document).find('#container-accordion-modules').append(newModule.html());
    }
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