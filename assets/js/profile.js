$('.tab-item').on('click',function(){
    $('.tab-item').removeClass('active');
    $(this).addClass('active');

    var _id = $(this).attr('id');
    _id = _id.replace('tab-', '');
    
    $('.tab-content').fadeOut();
    $(`#${_id}-content`).fadeIn();
})

//Sends the user to help options page
$('#settings').on('click',function(){
  window.location.href = '/options'
});

//sends the user to payments/card page
$('#userOptions').on('click',function(){
  window.location.href = '/card'
});

var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
var date = new Date();
date.setDate(date.getDate());
date = date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear();
//Set Date
$('#current-date').html(date);

//JS Control Code
function OnCurrentUserLoadComplete(){
    //Set Header
    $('#greetings').html('Hi '+currentUser.dbData.firstName);
    
    loadExploreTabComponents();

    loadHomeTabComponents();
    
}

function managecsv(routeid,routename,time,status,type){
  var param= {
    user_id: currentUser.dbData.id,
    user_name: currentUser.dbData.firstName,
    location: routename,
    user_email: currentUser.dbData.email,
    route_id: routeid,
    time: time,
    phonenumber: currentUser.dbData.phone,
    status: status,
    type: type
  }

  return jQuery.ajax({
    type: 'POST',
    url: '/profile',
    data: param,
    success: function(result) {
      return result;
      // alert(result);		
    },
    async: false
     }).responseText;
      // async, false;
}



