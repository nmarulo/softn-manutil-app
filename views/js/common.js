function checkFormValidity(elementForm) {
    elementForm.addClass('was-validated');

    return elementForm.get(0).checkValidity();
}

function resetElementForm(elementForm) {
    removeClassWasValidated(elementForm);
    elementForm.get(0).reset();
    elementForm.find('input').removeAttr('disabled');
}

function removeClassWasValidated(element) {
    element.removeClass('was-validated');
}

function getFormObject(elementForm) {
    var obj = {};
    var serialize = elementForm.serializeArray();

    for (var i = 0, len = serialize.length; i < len; i++) {
        var name = serialize[i]["name"];
        var value = serialize[i]["value"];

        obj[name] = value;
    }

    return obj;
}