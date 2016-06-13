var AnagramSolver = {
    $resultContainer: $('#results'),
    $resultContainerTitle: $('#result-title'),
    $inputField: $('#input-anagram'),
    $loader: $('#loader'),

    noResult: function () {
        AnagramSolver.$resultContainerTitle.html('No results');
        AnagramSolver.$resultContainerTitle.show();
    },

    errorAPI: function(){
        AnagramSolver.$resultContainerTitle.html('Oops an error occured. Try again later!');
        AnagramSolver.$resultContainerTitle.show();
    },

    showResult: function (oplossingen) {
        // Create a new element for each
        for (woord in oplossingen.results) {
            jQuery('<li/>', {
                class: 'list-group-item',
                text: oplossingen.results[woord]
            }).appendTo('#results ul');

        }

        AnagramSolver.$resultContainer.show();
    },

    solveAnagram: function (anagram) {
        // Hide the result title
        AnagramSolver.$resultContainerTitle.hide();

        // Get the language of the anagram
        var language = $('input[name="language"]:checked').val();

        // Empty the results div
        AnagramSolver.$resultContainer.find('ul').empty();

        // Show the loader
        AnagramSolver.$loader.show();

        // Make the request
        $.ajax({
            url: "https://pmfd0zm8c1.execute-api.us-west-2.amazonaws.com/prod/AnagramSolver",
            type: "get",
            data: {
                anagram: anagram.toLowerCase(),
                lang: language
            },
            dataType: 'json',

            success: function (response) {
                if(response.errorMessage !== undefined){
                    AnagramSolver.errorAPI();
                    return false;
                }

                if (response.resultCount === 0) {
                    AnagramSolver.noResult();
                } else {
                    AnagramSolver.showResult(response);
                }
            },

            error: function (xhr) {
                AnagramSolver.errorAPI();
            }
        }).done(function () {

            // Always hide the loader after the request
            AnagramSolver.$loader.hide();
        });
    }
};

window.onload = function () {

    // Listen for keypress events on the input field
    document.getElementById('input-anagram').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;

        // If enter was pressed, solve the anagram!
        if (keyCode == '13') {
            AnagramSolver.solveAnagram($(this).val());
            return false;
        }
    }
};