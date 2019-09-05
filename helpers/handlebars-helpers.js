module.exports = {
    select: function(selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
    }
}

// i dont understand this part as well