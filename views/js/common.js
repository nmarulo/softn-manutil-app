function checkFormValidity(elementForm) {
    elementForm.addClass('was-validated');

    return elementForm.get(0).checkValidity();
}

function resetElementForm(elementForm) {
    elementForm.removeClass('was-validated');
    elementForm.get(0).reset();
    elementForm.find('input').removeAttr('disabled');
}