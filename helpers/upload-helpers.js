 module.exports = {
//i dont understand this part as well
     isEmpty: function(obj) {
         for (let key in obj) {
             if (obj.hasOwnProperty(key)) {
                 return false;
             }
         }
         return true;
     }

 };