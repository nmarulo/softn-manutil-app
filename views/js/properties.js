(function () {
    $(document).on('click', '#modal-btn-edit', function () {
        var formEditProperties = $(document).find('#form-edit-properties');
        var inputProjectModules = $(document).find('#input-project-modules');
        var modalFormAddModule = $(document).find('#modal-form-add-module');
        var inputTemplateReplace = modalFormAddModule.find('#input-project-classes-template-replace');
        var inputProjectModuleId = $(document).find('#input-project-module-id');
        var replaceObj = {};
        var moduleObjects = [];
        var moduleObj = {};

        if (inputProjectModules.val().length > 0) {
            moduleObjects = JSON.parse(inputProjectModules.val());
        }


        modalFormAddModule.find('#nav-add-module-data > .form-group').each(function () {
            var inputHidden = $(this).find('input[type=hidden]');
            var inputText = $(this).find('input[type=text]');

            if (inputHidden.length > 0 && inputText.length > 0) {
                replaceObj[inputHidden.val()] = inputText.val()
            }
        });
        inputTemplateReplace.val(JSON.stringify(replaceObj));

        var modalFormSerialize = $(document).find('#modal-form-add-module').serializeArray();

        for (var i = 0, len = modalFormSerialize.length; i < len; i++) {
            var name = modalFormSerialize[i]["name"];
            var value = modalFormSerialize[i]["value"];

            moduleObj[name] = value;
        }

        //Si no tiene ID se le establece uno y se agrega a la lista de módulos
        if (inputProjectModuleId.val().length === 0) {
            var id = 1;

            if (moduleObjects.length > 0) {
                var lastModule = moduleObjects[moduleObjects.length - 1];
                id = parseInt(lastModule["projectModuleId"]) + 1;
            }

            moduleObj["projectModuleId"] = id;

            moduleObjects = moduleObjects.concat(moduleObj);
        } else {
            for (var i = 0, len = moduleObjects.length; i < len; i++) {
                if (moduleObjects[i]["projectModuleId"] == inputProjectModuleId.val()) {
                    moduleObjects[i] = moduleObj;
                    break;
                }
            }
        }

        inputProjectModules.val(JSON.stringify(moduleObjects));

        console.log(formEditProperties.serializeArray());
    });
    $(document).on('click', '.modal-btn-replace-delete', function () {
        $(this).closest('.form-group').remove();
    });
    $(document).on('click', '#modal-btn-replace-add', function () {
        var elementNav = $(document).find('#nav-add-module-data');
        var lastInput = elementNav.find('.form-group > input[type=hidden]:last');
        var pos = 1;

        if (lastInput.length === 1) {
            pos = parseInt(lastInput.val()) + 1;
        }

        var html = '<div class="form-group">\n' +
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
        elementNav.append(html);
    });
})();