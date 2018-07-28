const common = require('./common');

let inputProjectModules;
let formAddModule;
let navAddModuleData;
let inputProjectModuleId;
let inputTemplateReplace;
let modalAddModule;
let modalAddModuleTitle;
let modalBtnAdd;
let modalBtnEdit;
let modalBtnDelete;
let containerAccordionModules;
let formEditProperties;

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
    containerAccordionModules = $(document).find('#container-accordion-modules');
    formEditProperties = $(document).find('#form-edit-properties');
    inputProjectModules.val("[]");

    $(document).on('click', '#btn-edit-properties', function () {
        if (common.checkFormValidity(formEditProperties)) {
            common.removeClassWasValidated(formEditProperties);
            btnEditProperties();
        }
    });
    $(document).on('click', '#modal-btn-add', function () {
        if (common.checkFormValidity(formAddModule)) {
            btnAddFormAddModule();
            modalAddModule.modal('hide');
        }
    });
    $(document).on('click', '#modal-btn-edit', function () {
        if (common.checkFormValidity(formAddModule)) {
            btnEditFormAddModule(inputProjectModuleId.val());
            modalAddModule.modal('hide');
        }
    });
    $(document).on('click', '#modal-btn-delete', function () {
        btnDeleteModule(inputProjectModuleId.val());
    });
    $(document).on('click', '.modal-btn-replace-delete', function () {
        //Solo elimino el elemento, ya que, al pulsar editar se vuelve a obtener toda la lista.
        $(this).closest('.form-group').remove();
    });
    $(document).on('click', '#modal-btn-replace-add', function () {
        let lastInput = navAddModuleData.find('.form-group > input[type=hidden]:last');
        let pos = 1;

        if (lastInput.length === 1) {
            pos = parseInt(lastInput.val()) + 1;
        }

        appendHtmlTemplateReplace(pos);
    });
    $('#modal-add-module').on('show.bs.modal', function (event) {
        let moduleId = $(event.relatedTarget).data('project-module-id');
        let modalTitle = 'Nuevo modulo';

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
    $(document).on('keypress', '#input-project-module-name', function (event) {
        if (event.keyCode === 32) {//Barra espaciadora
            return false;
        }
    });
})();

function btnEditProperties() {
    let formObj = common.getFormObject(formEditProperties);
    formObj = parseFormObjModules(formObj);

    let json = JSON.stringify(formObj).replace(/"/g, '\'');
    let properties = common.getFilePathProperties();

    common.execJava('--edit-properties -p "' + properties + '" --json "' + json + '"', function (stdout) {
        common.modalInformation(stdout);
    });
}

function parseFormObjModules(formObj) {
    formObj['projectModules'] = JSON.parse(formObj['projectModules']).map(function (value) {
        value['projectClassesTemplateReplace'] = JSON.parse(value['projectClassesTemplateReplace']);

        return value;
    });

    return formObj;
}

function btnDeleteModule(moduleId) {
    let moduleObj = getModuleObjectById(moduleId);
    let moduleObjects = getModuleObjects().filter(function (value) {
        return value['projectModuleId'] != moduleId;
    });

    updateProjectModules(moduleObjects);
    removeHtmlModuleList(moduleObj['projectModuleName'], moduleObj['projectModuleId']);
}

function removeClassDNone(elementBtn) {
    elementBtn.removeClass('d-none');
}

function appendHtmlTemplateReplace(pos, callback) {
    let html = getTemplateReplaceHtml(pos);

    if (callback !== undefined) {
        html = callback(getTemplateReplaceHtml(pos));
    }

    navAddModuleData.append(html);
}

function fillFormAddModule(moduleId) {
    let moduleObj = getModuleObjectById(moduleId);
    let templateReplaceStr = moduleObj['projectClassesTemplateReplace'];
    let templateReplaceObj = JSON.parse(templateReplaceStr);
    let inputModuleName = formAddModule.find('#input-project-module-name');

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
            let element = $('<div></div>').append(html);

            element.find('input[type=text]').attr('value', templateReplaceObj[key]);

            return element.html();
        });
    });
}

function getModuleObjectById(id) {
    let moduleObjects = getModuleObjects();
    let moduleObj = {};

    for (let i = 0, len = moduleObjects.length; i < len; i++) {
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
    common.resetElementForm(formAddModule);
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
    let moduleObjects = getModuleObjects();
    let moduleObj = getFormAddModuleObj();

    for (let i = 0, len = moduleObjects.length; i < len; i++) {
        if (checkModuleId(moduleObjects[i], projectModuleId)) {
            /*
             * Se establece "projectModuleName", ya que, este campo esta deshabilitado
             * y no se obtiene con el "serializeArray" de en "getFormAddModuleObj()".
             */
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
    let moduleObjects = getModuleObjects();
    let moduleObj = getFormAddModuleObj();
    let id = 1;

    if (moduleObjects.length > 0) {
        let lastModule = moduleObjects[moduleObjects.length - 1];
        id = parseInt(lastModule["projectModuleId"]) + 1;
    }

    moduleObj["projectModuleId"] = id;

    updateHtmlModulesList(moduleObjects, moduleObj, true);
    updateProjectModules(moduleObjects.concat(moduleObj));
}

function removeHtmlModuleList(moduleName, moduleId) {
    let elementContainerUl = containerAccordionModules.find('div[id=' + moduleName + ']');
    let elementLi = function () {
        return elementContainerUl.find('ul.list-group li');
    };

    elementLi().find('a[data-project-module-id=' + moduleId + ']').closest('li').remove();
    containerAccordionModules.find('div[id=collapse-' + moduleName + '] span.badge').text(elementLi().length);

    if (elementLi().length === 0) {
        containerAccordionModules.find('div[id=collapse-' + moduleName + ']').remove();
        elementContainerUl.remove();
    }
}

function updateHtmlModulesList(moduleObjects, moduleObj, addNew) {
    let moduleName = moduleObj['projectModuleName'];
    let modulePackage = moduleObj['projectModulePackage'];
    let moduleId = moduleObj['projectModuleId']
    let newModule = $('<div></div>').append(getNewModuleHtml(moduleName));
    let newPackage = getNewModulePackageHtml(modulePackage, moduleId);

    moduleObjects = moduleObjects.filter(function (value) {
        return value['projectModuleName'] == moduleName;
    });

    if (moduleObjects.length > 0) {
        if (addNew) {
            //Se le suma 1, ya que aun no se ha agregado el nuevo modulo a la lista.
            containerAccordionModules.find('div[id=collapse-' + moduleName + '] span.badge').text(moduleObjects.length + 1);
            containerAccordionModules.find('div[id=' + moduleName + '] > ul.list-group').append(newPackage);
        } else {
            containerAccordionModules.find('div[id=' + moduleName + '] > ul.list-group > li.list-group-item > a[data-project-module-id=' + moduleId + ']').text(modulePackage);
        }
    } else {
        newModule.find('div > ul.list-group').append(newPackage);
        $(document).find('#container-accordion-modules').append(newModule.html());
    }
}

function getModuleObjects() {
    let modules = inputProjectModules.val();
    let moduleObjects = [];

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

    return common.getFormObject(formAddModule);
}

function updateTemplateReplace() {
    let replaceObj = {};

    navAddModuleData.find('.form-group').each(function () {
        let inputHidden = $(this).find('input[type=hidden]');
        let inputText = $(this).find('input[type=text]');

        if (inputHidden.length > 0 && inputText.length > 0) {
            replaceObj[inputHidden.val()] = inputText.val()
        }
    });

    inputTemplateReplace.val(JSON.stringify(replaceObj));
}