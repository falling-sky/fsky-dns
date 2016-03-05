var files = [ "v6ns","domain","v6ns1"];
var variables = [ "domain","ns","hostmaster","4","6","1280","buggy","serial" ];


function update_serial() {
 // Borrowed from http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript
 // http://stackoverflow.com/users/525895/samuel-meddows
 var today = new Date();
 var dd = today.getDate();
 var mm = today.getMonth()+1; //January is 0!
 var yyyy = today.getFullYear();
 
 if(dd<10) {
     dd='0'+dd
 } 
     
 if(mm<10) {
   mm='0'+mm
 } 
 $("#form_serial").val(   yyyy + mm + dd );        

}
function update_buggydns() {
  ipv4 = $("#form_4").val();
  parts = ipv4.split(".");
  s = "";
  for (i=0; i < parts.length; i++) {
    val = parseInt(parts[i],10);
    hex = val.toString(16);
    if (hex.length == 1) {
      hex = "0" + hex;
    }
    s = s + hex;
  }
  r = s.substring(0,4) + ":" + s.substring(4,8) + ":" + 
  s.substring(0,4) + ":" + s.substring(4,8) + ":" + 
  s.substring(0,4) + ":" + s.substring(4,8) + ":" + 
  s.substring(0,4) + ":" + s.substring(4,8);
  $("#form_buggy").val(r)
  
  if (parts[0] < 32) {
    return true;
  }
  if (parts[0] > 63) {
    return true;
  }
  return false;
}


function update_templates() {
  try {
    update_serial();
    safe=update_buggydns()
  } catch (err) {
  }

  for (i=0; i < files.length; i++) {
    file = files[i];
    template = templates[file];
    
    if (safe) {
      template = template.replace(/;buggydns1/,'buggydns1');
    }
    
    for (j=0; j < variables.length; j++) {
        variable = variables[j];
        find = "#form_" + variable;
        found = $(find).val();
        if (found.length > 0) {
          re = new RegExp('[$]argv[{]' + variable + '[}]','gi');
          template = template.replace(re,found);
        }
    }
    divid = '#code_' + file;
    jQuery(divid).text(template);
  }
}

function set_handlers() {
    for (j=0; j < variables.length; j++) {
        variable = variables[j];
        find = "#form_" + variable;
        $(find).change(update_templates)
        $(find).blur(update_templates)
    }
}


$( document ).ready(function() {
     // Your code here.
     set_handlers();
     update_templates();
});
      