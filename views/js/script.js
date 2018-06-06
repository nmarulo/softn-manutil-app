let gstdout;

(function () {
    $('#form-create-files').on('submit', function (event) {
        event.preventDefault();
        let fileJar = $(this).find('#form-input-file-jar').val();
        let fileProperties = $(this).find('#form-input-file-jar').val();
        let fileNameClass = $(this).find('#form-input-name-class').val();
        let directoryNameModule = $(this).find('#form-input-name-module').val();
        let cli = 'java -jar ' + fileJar + ' -p ' + fileProperties + ' -c ' + fileNameClass;

        if(directoryNameModule.length > 0){
            cli += ' -m ' + directoryNameModule;
        }

        exec(cli, (err, stdout, stderr) => {
            gstdout = stdout;

            $('#modal-information-console-java').modal('show');

            if (err) {
                return;
            }
        });
    });
    $('#modal-information-console-java').on('show.bs.modal', function () {
        $(this).find('.modal-body').text(gstdout);
    });
})();