(function ($) {
    $(document).ready(function() {
      $('.calc-form');
      $('#commit-calc').click(function(e) {
          e.preventDefault();
          runTravelCalc();
      });

    });

})(jQuery);// JavaScript Document



function debug(desc, input) {
  console.log(desc + ': ' + input);
}

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
  console.log(deceldisttravel);
  $(calcOutputFields['accinitdelta']).val(accinitdelta);
  $(calcOutputFields['acctimeburn']).val(acctimeburn);
  $(calcOutputFields['accdisttravel']).val(accdisttravel);
  $(calcOutputFields['decelbrakedelta']).val(decelbrakedelta);
  $(calcOutputFields['deceltimeburn']).val(deceltimeburn);
  $(calcOutputFields['deceldisttravel']).val(deceldisttravel);

  var totaldisttravel = (calcInputValues['traveldist'])-(accdisttravel+deceldisttravel);
  var totalvel = (totaldisttravel*1000)/(calcInputValues['travelvel']*3600);

  $(totalFields['totaldisttravel']).val(totaldisttravel);
  $(totalFields['totalvel']).val(totalvel);

  var totalTravelHours = acctimeburn+deceltimeburn+totalvel;
  var totalTravelWeeks = totalTravelHours/168;

  $(sumTotalFields['totalTravelHours']).val(totalTravelHours);
  $(sumTotalFields['totalTravelWeeks']).val(totalTravelWeeks);

}
