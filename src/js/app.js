import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parse} from './parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('#ParsedContent').empty();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let parsedArray = parse(parsedCode.body);
        $.each(parsedArray, function () {
            $('#ParsedContent').append('<tr align="center"><td>'+
                this.line+'</td><td>'+
                this.type+'</td><td>'+
                this.name+'</td><td>'+
                this.condition+'</td><td>'+
                this.value+'</td></tr>');
        });

    });
});
