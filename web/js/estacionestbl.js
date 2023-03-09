$('#estacionestbl').DataTable( {
    ajax: 'https://rendiapps.ddns.net/restServer/api/ObtenerEmpresas',
      columns: [
          { title: "N° Estacion",className: 'dt-center',width:'15%'},
          { title: "Razón Social",className: 'dt-center',width:'60%'},
          { title: "Opciones",className: 'dt-center',width:'25%'}
      ],
      order: [1, 'asc'],
      responsive: true,
      bLengthChange: false,
      pageLength: 7,
      language: {
          "sProcessing":     "Procesando...",
          "sLengthMenu":     "Mostrar _MENU_ registros",
          "sZeroRecords":    "No se encontraron resultados",
          "sEmptyTable":     "Ningún dato disponible en esta tabla",
          "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
          "sInfoPostFix":    "",
          "sSearch":         "Buscar:",
          "sUrl":            "",
          "sInfoThousands":  ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
              "sFirst":    "Primero",
              "sLast":     "Último",
              "sPrevious": "Anterior"
          },

      },

      dom: '<"html5buttons"B>lTfgitp',
      buttons: [
      ],

  });

  $(document).on("click",".facturar",function(e){
    let servidor = 'http://'+$(this).attr("servidor")+'/facturas/autofactura.aspx?';
    window.open(servidor,'_blank');
  })

  $(document).on("click",".consultar",function(e){
    let servidor = 'http://'+$(this).attr("servidor")+'/facturas';
    window.open(servidor,'_blank');
  })

  function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
  }


  $(document).on('change',"#opcion",function(e){
    let opcion = $(this).val();
    switch (opcion) {
      case "1":
        $("#rhinfo").removeAttr("style");
        $("#ventasinfo").css("display","none");
        $("#clientesinfo").css("display","none");
        $("#ubicaciondafi").removeAttr("style");
        $("#ubicacionred").css("display","none");
        break;
      case "2":
        $("#rhinfo").css("display","none");
        $("#ventasinfo").removeAttr("style");
        $("#clientesinfo").css("display","none");
        $("#ubicaciondafi").removeAttr("style");
        $("#ubicacionred").css("display","none");
        break;
      case "3":
        $("#rhinfo").css("display","none");
        $("#ventasinfo").css("display","none");
        $("#clientesinfo").removeAttr("style");
        $("#ubicaciondafi").css("display","none");
        $("#ubicacionred").removeAttr("style");
        break;
      default:
    }
  })


  $("#btnsubmit").click(function(e){
    e.preventDefault();
    $("#btnsubmit").css("pointer-events","none");
    $("#btnsubmit").html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Enviando');
    $("#contactForm").bootstrapValidator('validate');
    var valid= $("#contactForm").data('bootstrapValidator').isValid();
    console.log("valid "+valid);
    if (valid) {
      let datos = $("#contactForm").serialize();
      $.post("https://rendiapps.ddns.net/rendiapps/PagoProveedores/AppsSS/paginaCorreo",datos,function(data){
        $("#btnsubmit").removeAttr("style");
        $("#btnsubmit").html('Enviar Mensaje');
        $("#successcorreo").removeAttr("style");
        $("#successcorreo").append('<strong>Exito!</strong> Correo enviado correctamente a ' + $("#opcion option:selected").text() +'. <button  class="close" data-dismiss="alert" aria-label="Close">'+
                              // '<span aria-hidden="true">&times;</span>'+
                            '</button>');
        $('#contactForm').data('bootstrapValidator').resetForm(true);

      },"json").fail(function(e,x,error){
        $("#btnsubmit").removeAttr("style");
        $("#btnsubmit").html('Enviar Mensaje');
        console.log(error);
      })
    }else {
      $("#btnsubmit").removeAttr("style");
      $("#btnsubmit").html('Enviar Mensaje');
    }
  return false;
  })


  $(document).ready(function() {
      $('#contactForm').bootstrapValidator({
        feedbackIcons: {
          },
          fields: {
              nombre: {
                  validators: {
                          notEmpty: {
                            message: 'Ingrese su nombre'
                          }
                  }
              },
              correo: {
                  validators: {
                          notEmpty: {
                            message: 'Ingrese su correo'
                          },
                          emailAddress: {
                            message: 'No tiene formato de correo'
                          },
                  }
              },
              asunto: {
                  validators: {
                          notEmpty: {
                            message: 'Ingrese un asunto'
                          }
                  }
              },
              opcion: {
                  validators: {
                          notEmpty: {
                            message: 'Ingrese una opcion'
                          }
                  }
              },
              mensaje: {
                  validators: {
                          notEmpty: {
                            message: 'Ingrese una opcion'
                          }
                  }
              },
            }
          });
  });

  //

  $.get("https://rendiapps.ddns.net/restServer/api/estacionesGeo",{},function(data){
    if (data.length > 0) {
      $(data).each(function(i,item){
        $("#testaciones").append("<tr >"+
                                    "<td class='verMapa' lng='"+item.lng+"' lat='"+item.lat+"' icon='"+item.icon+
                                                                  "' direccion='"+item.direccion+"' magna='"+item.magna+"' fecha_magna='"+item.fecha_magna+
                                                                  "' premium='"+item.premium+"' fecha_premium='"+item.fecha_premium+"' diesel='"+item.diesel+
                                                                  "' fecha_diesel='"+item.fecha_diesel+"' nombre='"+item.nombre+"'>"+item.nombre+"</td>"+
                                 "</tr>")
      })
    }
  },"json").fail(function(e,x,error){
    console.log(error);
  });

  $(document).on("click",".verMapa",function(e){
    let estacion = {
      'lng': $(this).attr("lng"),
      'lat': $(this).attr("lat"),
      'nombre': $(this).attr("nombre"),
      'icon': $(this).attr("icon"),
      'direccion': $(this).attr("direccion"),
      'magna': $(this).attr("magna"),
      'fecha_magna': $(this).attr("fecha_magna"),
      'premium': $(this).attr("premium"),
      'fecha_premium': $(this).attr("fecha_premium"),
      'diesel': $(this).attr("diesel"),
      'fecha_diesel': $(this).attr("fecha_diesel")

    }
    $(".verMapa").removeAttr("bgcolor");
    $(this).attr("bgcolor","#ddd");
    mostrar(estacion)
  })

function mostrar(estacion){
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(estacion.lng,estacion.lat),
    zoom: 14
  });

  var point = new google.maps.LatLng(
      parseFloat(estacion.lng),
      parseFloat(estacion.lat));

    var Circle = new google.maps.Circle({
           strokeColor: '#00a65a',
           strokeOpacity: 0.5,
           strokeWeight: 2,
           fillColor: '#00a65a',
           fillOpacity: 0.35,
           map: map,
           center: new google.maps.LatLng(estacion['lng'],estacion['lat']),
          //  radius: 2000
         });

         var icon = {};
         var marker = new google.maps.Marker({
           map: map,
           position: point,
           label: icon.label,
           icon: estacion['icon']
         });

         var infowincontent = '<div>'+
               '<p style="font-size:14px"><i style="color:#386090;font-size:20px" class="fa fa-tag"></i>  <b>'+ estacion.nombre+'</b></p>'+
               '<p style="font-size:14px"><i style="color:red;font-size:20px" class="fa fa-map-marker"></i> '+ estacion.direccion+'</p>'+
               '<div class="table-responsive no-padding">'+

                 '<table class="table table-hover">'+
                    '<tbody>'+
                       '<tr>'+
                        '<th>Combustible</th>'+
                        '<th>MXN</th>'+
                        '<th>Actualización</th>'+
                       '</tr>'+
                       '<tr>'+
                        '<td><span class="badge badge-success" style="font-size:105%;">Magna</span></td>'+
                        '<td>'+estacion.magna+'</td>'+
                        '<td>'+convertDate(estacion.fecha_magna)+'</td>'+
                       '</tr>'+
                       '<tr>'+
                        '<td><span class="badge badge-danger" style="font-size:105%;">Premium</span></td>'+
                        '<td>'+estacion.premium+'</td>'+
                        '<td>'+convertDate(estacion.fecha_premium)+'</td>'+
                       '</tr>'+
                       '<tr>'+
                        '<td><span class="badge badge-default" style="background-color: black;color: white;font-size:105%;">Diesel</span></td>'+
                        '<td>'+((estacion.diesel>0)?estacion.diesel:'<b>N/D</b>')+'</td>'+
                        '<td>'+((estacion.diesel>0)?convertDate(estacion.fecha_diesel):'<b>N/D</b>')+'</td>'+
                       '</tr>'+
              '</tbody></table>'
               '</div>'+
             '</div>';

        //  marker.addListener('click', function() {
           infoWindow.setContent(infowincontent);
           infoWindow.open(map, marker);
        //  });

         var comp = document.getElementById(estacion.nombre);
         if (comp) {
           google.maps.event.addDomListener(comp,'click',function(){
             infoWindow.setContent(infowincontent);
             infoWindow.open(map, marker);
           });
         }

  }

  function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(24.788894, -107.428449),
    zoom: 8
  });
  infoWindow = new google.maps.InfoWindow;
  }

  function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
  }

  function CargaScript() {
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyByVgWLve0CNSrpVzQJM3cfMv_ij5P-CnY&callback=initMap';
      document.body.appendChild(script);
  }

  window.onload = CargaScript;
