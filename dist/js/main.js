function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function mas($button){
    var oldValue = $button.parent().find("input").val().trim();
    var step = $button.parent().find("input").attr("step");
    if(step){
        var newVal =  parseInt(oldValue) + parseInt(step);
    }else{
        var newVal = parseInt(oldValue) + 1;
    }

    $button.parent().find("input").val(newVal);
    $button.parent().find("input").change();
}

function menos($button){
    var oldValue = $button.parent().find("input").val().trim();
    var step = $button.parent().find("input").attr("step");
    if(step){
        var newVal = parseInt(oldValue) - parseInt(step);
    }else{
        var newVal =  parseInt(oldValue) - 1;
    }
    $button.parent().find("input").val(newVal);
    $button.parent().find("input").change();
}

function cambiarCantidad(diff){
    let total_cantidad =  $("#cantidad-total").val().trim();
    $("#cantidad-total").val(parseInt(total_cantidad)+diff);
    $("#total-productos").html($("#cantidad-total").val());
    return 0;
}

function cambiarTotal(diff){
    let total = parseFloat($("#total").val().trim());
    let totalChange = parseFloat($("#total-change").val().trim());
    let cambio =  parseFloat($('#cambio').val().trim());



    let n_total = total+diff;
    let n_change=n_total/cambio;
    console.log(n_change);

     if(n_total<0.1){
         n_total=0.00;
     }
     if(n_change<0.1){
         n_change=0.00;
     }

     n_change = Math.round((n_change + Number.EPSILON) * 100) / 100;
     n_total = n_total.toFixed(2);

    $("#total").val(n_total);
    $("#total-change").val(n_change);

    $("#total-aux").html(numberWithCommas(n_total));
    $("#total-aux-tabla").html(numberWithCommas(n_total));

    $("#total-change-aux").html(numberWithCommas(n_change));

    return 0;
}


function appendToTable(input) {
    var regex = new RegExp("^(?:(?:(?:\\d+\\.)?\\d+)(?:\\*)?)(?:(?:(?:\\d+\\.)?\\d+)?)$");
    if (regex.test(input)) {
        var subs = input.split('*');
        if(subs.length>1){
            var numero1 = parseFloat(subs[0]);
            var numero2 = parseFloat(subs[1]);
        }else{
            var numero1 = parseFloat(subs[0]);
            var numero2 = parseFloat(1);
        }


        var id_new = $('#id_form-TOTAL_FORMS').val(); //Varibale para sabr cual es el siguiente id del formset
        var form_idx =  $('#form-ultimo').val(); //Variable contador de forms

        var sub = numero1*numero2;
        sub = sub.toFixed(2);


        //crea el input para la cantidad aux y el costo aux
        var div = `<input type="number" step="1" class="form-control input-lg pull-right" min="0" placeholder="0" id="id_cantidad_${id_new}">`;
        var div2 = `<input type="number" class="form-control input-lg pull-right" min="0" placeholder="0" id="id_costo_${id_new}">`;

        cambiarCantidad(numero2);
        cambiarTotal(parseFloat(sub));
        console.log(id_new);

        //agrega la tabla
        $('#myTable tr:last').before(`
                    <tr id="${id_new}">
                      <td class="text-center">
                          <a type="button" id="quitar-lista-${id_new}" class="quitar-lista btn btn-danger btn-lg" data-id="${id_new}">
                              <i class="fa fa-trash"></i>
                          </a>
                        </td>
                       <td>
                       <div>`
                            + div2 +
                       `</div>
                       </td>
                       <td>`
                       + div +
                        `<input type="number" style="display:none" type="hidden" name="sub-total${id_new}" value="${sub}" id="sub-total${id_new}">
                        </td>
                       <td class="text-center">
                            <h4 id="sub_${id_new}"> ${numberWithCommas(sub)}</h4>
                       </td>
                    </tr>`);



                    $('#quitar-lista-'+id_new).on('click',function() {

                            var sub = parseFloat($("#sub-total"+$(this).attr("data-id")).val().trim());
                            var cantidad = parseInt($("#id_cantidad_"+$(this).attr("data-id")).val());


                            //Modifica el input de cantidad de productos totales y la pizarra de totales
                            cambiarTotal(-sub);
                            cambiarCantidad(-cantidad);


                            $('#myTable #' + $(this).attr("data-id")).remove();


                            //Contador de filas actuales
                            var form_idx =  $('#form-ultimo').val();
                            $('#form-ultimo').val(parseInt(form_idx) - 1 );
                            $('#nro-items').html($('#form-ultimo').val());

                            if($('#myTable tr').length==2){
                                $("#total-aux-tabla").hide();
                            }
                    });


                    $("#id_cantidad_"+id_new).on("input change", function(){

                        var min = parseInt($(this).attr('min'));

                        var v = $(this).val().trim();

                        if(v==""){ // si es vacio no hace nada
                            return 0;
                        }

                       if (v < min){ //verifica que el monto no se pase del min ni del max
                           $(this).val(min);
                       }


                       var old = parseFloat($("#sub-total"+id_new).val().trim());



                       var subn = ($("#id_costo_"+id_new).val().trim()*$(this).val().trim()).toFixed(2);

                       $("#sub_"+id_new).html(numberWithCommas(subn));
                       $("#sub-total"+id_new).val(subn);
                       var dif = subn - old;

                       cambiarTotal(parseFloat(dif));
                       return 0;

                    });



                    $("#id_costo_"+id_new).on("input change", function(e){


                        var min = parseInt($(this).attr('min'));

                        var v = $(this).val().trim();

                       if (v < min){
                           $(this).val(min);
                       }


                        var old = parseFloat($("#sub-total"+id_new).val().trim());

                        var subn = ($("#id_cantidad_"+id_new).val().trim()*$(this).val().trim()).toFixed(2);


                        $("#sub_"+id_new).html(numberWithCommas(subn));
                        $("#sub-total"+id_new).val(subn);
                        var dif = subn - old;
                        cambiarTotal(parseFloat(dif));
                        return 0;
                    });


                    $("#total-aux-tabla").show();
                    $("#id_cantidad_"+id_new).val(numero2);

                    $("#id_costo_"+id_new).val(numero1);

                    $('#form-ultimo').val(parseInt(form_idx) + 1);

                    $('#id_form-TOTAL_FORMS').val(parseInt(id_new) + 1);
                    $('#form-ultimo').val(parseInt(form_idx) + 1 );

                    $('#nro-items').html($('#form-ultimo').val());

    }else{
        alert("Formato invalido: Numero * Numero");
    }

}



function Only (e) {  // Accept only alpha numerics, no special characters
    var regex = new RegExp("^[*.0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
}


function Only2 () {  // Accept only alpha numerics, no special characters
    return Only (this.event); // window.event
}


$(window).keyup(function(event){

  if(event.keyCode == 13 || event.keyCode == 107) {

      //Busca el valor que tiene el input
      var input = $('input[name="buscador2"]').val().trim();
      $('input[name="buscador2"]').val('');//Setea el valor en "" para un nuevo


      if(input==""){ //Si el valor es 0 lo cancela
          return 0;
      }

      appendToTable(input);


  }





});



$(document).ready( function () {

//$("#div-total-change").hide();
//$("#div_id_cambio_compra").hide();
$("#total-aux-tabla").hide();
$("#aux_id_cambio_compra").val(1);



$("#id_usar_cambio").change(function(){

    if($(this).val()=="1"){
        $("#div_id_cambio_compra").show();
        $("#div-total-change").show();
    }else{
        $("#div-total-change").hide();
        $("#aux_id_cambio_compra").val(1);
        $("#div_id_cambio_compra").hide();
    }
});


$("#aux_id_cambio_compra").on("input change", function(){

    var min = parseInt($(this).attr('min'));
    var v = $(this).val().trim();

    if(v==""){ // si es vacio no hace nada
        return 0;
    }

   if (v < min){ //verifica que el monto no se pase del min ni del max
       $(this).val(min);
   }

    //actualiza el form con la cantidad nueva
    $("#cambio").val($(this).val().trim());

});


$(".limpiarlista").on("click", function() {



     $("#myTableBody tr").each(function() { //Si el codigo ya esta registrado lo cancela
        $(this).find('.quitar-lista').click();
    });


});




} );
