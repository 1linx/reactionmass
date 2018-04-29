(function ($) {
    $(document).ready(function() {
      $('.calc-form');
      $('#commit-calc').click(function(e) {
          e.preventDefault();
          runTravelCalc();
      });

      $('#createForm').submit(function(e){
        console.log('Creating:');
        console.log($('#createForm').serialize());
        e.preventDefault();
        $.ajax({
          url:'/api/v1/post/',
          type:'post',
          data:$('#createForm').serialize(),
          success:function(){
            console.log('success');
          return false;
          }
        });
      });

      $('#delForm').submit(function(e){
        console.log('Deleting:');
        console.log($('#delForm').serialize());
        e.preventDefault();
        $.ajax({
          url:'/api/v1/delete/',
          type:'delete',
          data:$('#delForm').serialize(),
          success:function(){
            console.log('success');
          return false;
          }
        });
      });

      $('#fuelForm').submit(function(e){
          console.log('Submitted: ');
          console.log($('#fuelForm').serialize());
        e.preventDefault();
        $.ajax({
        url:'/api/v1/put/',
        type:'put',
        data:$('#fuelForm').serialize(),
        success:function(){
          console.log('success');
        return false;
        }
        });
      });
    });



})(jQuery);// JavaScript Document

function runTravelCalc() {

  var calcInputValues = {
    "traveldist": $('#travel-dist'),
    "accelg": $('#accel-g'),
    "startvel": $('#start-vel'),
    "travelvel": $('#travel-vel'),
    "deccelburn": $('#deccel-burn'),
    "targetvel": $('#target-vel'),
  }

  var calcOutputFields = {
  "accinitdelta": $('#acc-init-delta'),
  "acctimeburn": $('#acc-time-burn'),
  "accdisttravel": $('#acc-dist-travel'),
  "decelbrakedelta": $('#decel-brake-delta'),
  "deceltimeburn": $('#decel-time-burn'),
  "deceldisttravel": $('#decel-dist-travel'),
  }


  var totalFields = {
  "totaldisttravel": $('#total-dist-travel'),
  "totalvel": $('#total-vel'),
  }

  var sumTotalFields = {
  "totalTravelHours": $('#total-travel-hours'),
  "totalTravelWeeks": $('#total-travel-weeks'),
  }

  for (var variable in calcInputValues) {
    // get input values
    calcInputValues[variable] = parseFloat($(calcInputValues[variable]).val());
    // debug(variable,calcInputValues[variable] + ' - ' + typeof calcInputValues[variable]);
  }

  var accinitdelta = ((calcInputValues['travelvel']-calcInputValues['startvel'])*1000)/3600;
  var acctimeburn = (accinitdelta/(calcInputValues["accelg"]*9.82))/60;
  var accdisttravel = (0.5*(calcInputValues["accelg"]*9.82)*(acctimeburn*acctimeburn*3600))/1000;
  var decelbrakedelta = ((calcInputValues['travelvel']-calcInputValues['targetvel'])*1000)/3600;
  var deceltimeburn = (decelbrakedelta/(calcInputValues['deccelburn']*9.82))/60;
  var deceldisttravel = (0.5*(calcInputValues['deccelburn']*9.82)*((deceltimeburn*60)*(deceltimeburn*60)))/1000;

  $(calcOutputFields['accinitdelta']).val(round(accinitdelta));
  $(calcOutputFields['acctimeburn']).val(round(acctimeburn));
  $(calcOutputFields['accdisttravel']).val(round(accdisttravel));
  $(calcOutputFields['decelbrakedelta']).val(round(decelbrakedelta));
  $(calcOutputFields['deceltimeburn']).val(round(deceltimeburn));
  $(calcOutputFields['deceldisttravel']).val(round(deceldisttravel));

  var totaldisttravel = (calcInputValues['traveldist'])-(accdisttravel+deceldisttravel);
  var totalvel = (totaldisttravel*1000)/(calcInputValues['travelvel']*3600);

  $(totalFields['totaldisttravel']).val(round(totaldisttravel));
  $(totalFields['totalvel']).val(round(totalvel));

  var totalTravelHours = acctimeburn+deceltimeburn+totalvel;
  var totalTravelWeeks = totalTravelHours/168;

  $(sumTotalFields['totalTravelHours']).val(round(totalTravelHours));
  $(sumTotalFields['totalTravelWeeks']).val(round(totalTravelWeeks));

}

function debug(desc, input) {
  console.log(desc + ': ' + input);
}

function round(number, precision = 2) {
  var shift = function (number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
}

setTimeout(function() {
  console.log('tick');
  $('#wrapper').css('filter', 'blur(10px)');
}, 3000);
