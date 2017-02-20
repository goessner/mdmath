/**
* see https://github.com/hanifbbz/micromustache/blob/master/src/micromustache.js
* Replaces every {{member}} string inside the template string with values corresponding to obj[member].
* @param str {string} template string containing one or more {{member}} names or expressions.
* @param obj {object} object containing string (or number) values for every object member that is used in the template
* @return {string} template with member expressions replaced by object's member values.
*/
function applyTemplate(tmpl,obj) {
   function eval(name,val) {
      switch (typeof val) {
         case 'string':
         case 'number':
         case 'boolean':
            return val;
         case 'function':  // if the value is a function, call it passing the variable name
            return val(name);
         default:
            return '';
      }
   }
   return tmpl.replace(/\{?\{\{\s*(.*?)\s*\}\}\}?/g, function(match,variable) {
      var m1, m2, m3;
            variable.replace(/([^.]+)[\.](.+)[\.](.+)/g, function($0,$1,$2,$3) { m1 = $1; m2 = $2; m3 = $3; return ""; });
            if (!m1)
               variable.replace(/([^.]+)[\.](.+)/g, function($0,$1,$2) { m1 = $1; m2 = $2; return ""; });
            if (!m1)
               variable.replace(/(.+)/g, function($0,$1) { m1 = $1; return ""; });
            if      (m1 && !m2 && !m3) return eval(variable,obj[m1]);
            else if (m1 &&  m2 && !m3) return eval(variable,obj[m1][m2]);
            else if (m1 &&  m2 &&  m3) return eval(variable,obj[m1][m2][m3]);
            else                       return "";
         });
}

var eqno = [], md = markdownit({html:true});

function toMath(str) {
    function math(tex,disp) { // don't forget to escape '_','*', and '\' ..
        let res;
        try {
            // don't forget to escape '_','*', and '\' .. after math rendering
            res = katex.renderToString(tex,{throwOnError:false,displayMode:disp}).replace(/([_\*\\])/g, "\\$1");
        }
        catch(err) {
            res = err;
        }
        return res;
    }
    var rules = [
        { rex:/\\\$/g, tmpl: "\xB6" }, // substitute '\$' by '¶' temporarily ...
        { rex:/(\r?\n|^|>)\s*?\${2}([^$]*?)\${2}\s*?\(([^)$\r\n]*?)\)(?=$|\r?\n|\s)/g, tmpl: ($0,$1,$2,$3) => `${$1}<section class="eqno"><eqn>${math($2,true)}</eqn><span>(${$3})</span></section>\n` }, // display equation $$...$$ equation number
        { rex:/(\r?\n|^|>)\s*?\${2}([^$]*?)\${2}(?=$|\r?\n|\s)/g, tmpl: ($0,$1,$2) => `${$1}<section><eqn>${math($2,true)}</eqn></section>\n` }, // display equation $$...$$
        { rex:/(\D|\$|^)\$(\S[^$\r\n]*?\S)\$(?!\d)/g, tmpl: ($0,$1,$2) => `${$1}<eq>${math($2,false)}</eq>` },  // multi-character inline equation $...$
        { rex:/(\D|^)\$([^$\r\n\t ]{1})\$(?!\d)/g, tmpl: ($0,$1,$2) => `${$1}<eq>${math($2,false)}</eq>` },  // single-character inline equation $...$
        { rex:/\xB6/g, tmpl: "$" } // reverse temporary substitution ...
    ];

    for (var i in rules)
        str = str.replace(rules[i].rex, rules[i].tmpl);
    return md.render(str);
}

window.onload = function() {
   var rows = document.getElementById("rows"),
       tmpl = document.getElementById("row-tmpl"),
       row, cell, g, out = { width:201, height:101 };
   for (var i=0; i<tests.length; i++) {
      rows.innerHTML += tmpl.innerHTML;
      document.getElementById("row").id = "#"+i;
   }
   for (var i=0; i<tests.length; i++) {
      row = document.getElementById("#"+i);
      cell = row.getElementsByTagName("td");
      cell[0].innerHTML = i;
      cell[1].innerHTML = tests[i].valid ? "&#128522;" : "&#128545;";
      cell[2].innerHTML = tests[i].src.replace("<","&lt;");
      cell[3].innerHTML = toMath(tests[i].src);
      cell[4].innerHTML = tests[i].comment;
   }
}
