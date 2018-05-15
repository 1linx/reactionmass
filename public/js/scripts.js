(function ($) {
    $(document).ready(function() {
      $("#dist-tab").click(function(e) {
        $(this).addClass('selected');
        $('#dist-return').trigger('click');
        $('#burn-return').trigger('click');
        $('#mgnt-return').trigger('click');
        $('#burn-tab').removeClass('selected');
        $("#mgmt-tab").removeClass('selected');
        $(".content.distance").show();
        $(".burn").hide();
        $(".management").hide();
      });
      $("#burn-tab").click(function(e) {
        $(this).addClass('selected');
        $('#dist-return').trigger('click');
        $('#burn-return').trigger('click');
        $('#mgnt-return').trigger('click');
        $('#dist-tab').removeClass('selected');
        $("#mgmt-tab").removeClass('selected');
        $(".distance").hide();
        $(".content.burn").show();
        $(".mgmt").hide();
      });
      $("#mgmt-tab").click(function(e) {
        $(this).addClass('selected');
        $('#dist-return').trigger('click');
        $('#burn-return').trigger('click');
        $('#mgmt-return').trigger('click');
        $('#dist-tab').removeClass('selected');
        $("#burn-tab").removeClass('selected');
        $(".distance").hide();
        $(".burn").hide();
        $(".content.mgmt").show();
      });

      $('#dist-calc').click(function(e) {
          e.preventDefault();
          $('#dist-results').show();
          $('.input-holder').hide();
          $('#wrapper').scrollTop(0);
          $('.distance .bottom-button').hide();
          runTravelCalc();
      });

      $('#burn-calc').click(function(e) {
          e.preventDefault();
          $('#burn-results').show();
          $('#burn-cont').hide();
          $('#wrapper').scrollTop(0);
          $('.burn .bottom-button').hide();
          runBurnCalc();
      });


      $('#dist-return').click(function(e) {
          $('#dist-results').hide();
          $('.input-holder').show();
          $('#wrapper').scrollTop(0);
          $('.distance.bottom-button').show();
      });

      $('#burn-return').click(function(e) {
          $('#burn-results').hide();
          $('#burn-cont').show();
          $('#wrapper').scrollTop(0);
          $('.burn .bottom-button').show();
      });

      timerFunc(3000, true, '.bottom-button #commit-calc', 'background-color', 'rgba(255, 0, 0, 0.2)', 'rgba(200, 0, 0, 0)');
      timerFunc(3000, true, '.bottom-button #burn-calc', 'background-color', 'rgba(255, 0, 0, 0.2)', 'rgba(200, 0, 0, 0)');

      $('#mgmt-calc').click(function(){
        console.log('Creating:');
        console.log($('#fuel-mass').val());
        $.ajax({
          url:'/api/v1/put/',
          type:'put',
          data:'rowId=fuelmass&fuelVal=' + $('#fuel-mass').val(),
          success:function(){
            console.log('success');
          return false;
          }
        });
      });


      // $('#createForm').submit(function(e){
      //   console.log('Creating:');
      //   console.log($('#createForm').serialize());
      //   e.preventDefault();
      //   $.ajax({
      //     url:'/api/v1/post/',
      //     type:'post',
      //     data:$('#createForm').serialize(),
      //     success:function(){
      //       console.log('success');
      //     return false;
      //     }
      //   });
      // });

      // $('#delForm').submit(function(e){
      //   console.log('Deleting:');
      //   console.log($('#delForm').serialize());
      //   e.preventDefault();
      //   $.ajax({
      //     url:'/api/v1/delete/',
      //     type:'delete',
      //     data:$('#delForm').serialize(),
      //     success:function(){
      //       console.log('success');
      //     return false;
      //     }
      //   });
      // });
      //
      // $('#fuelForm').submit(function(e){
      //     console.log('Submitted: ');
      //     console.log($('#fuelForm').serialize());
      //   e.preventDefault();
      //   $.ajax({
      //   url:'/api/v1/put/',
      //   type:'put',
      //   data:$('#fuelForm').serialize(),
      //   success:function(){
      //     console.log('success');
      //   return false;
      //   }
      //   });
      // });
    });



    // random timed blur effect
    // timerFunc(true, '0.5px');



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

  $(calcOutputFields['accinitdelta']).val(round(accinitdelta, 2));
  $(calcOutputFields['acctimeburn']).val(round(acctimeburn, 2));
  $(calcOutputFields['accdisttravel']).val(round(accdisttravel, 2));
  $(calcOutputFields['decelbrakedelta']).val(round(decelbrakedelta, 2));
  $(calcOutputFields['deceltimeburn']).val(round(deceltimeburn, 2));
  $(calcOutputFields['deceldisttravel']).val(round(deceldisttravel, 2));

  var totaldisttravel = (calcInputValues['traveldist'])-(accdisttravel+deceldisttravel);
  var totalvel = (totaldisttravel*1000)/(calcInputValues['travelvel']*3600);

  $(totalFields['totaldisttravel']).val(round(totaldisttravel, 2));
  $(totalFields['totalvel']).val(round(totalvel, 2));

  var totalTravelHours = acctimeburn+deceltimeburn+totalvel;
  var totalTravelWeeks = totalTravelHours/168;

  $(sumTotalFields['totalTravelHours']).val(round(totalTravelHours, 2));
  $(sumTotalFields['totalTravelWeeks']).val(round(totalTravelWeeks, 2));

}

function runBurnCalc() {
  var burnInputValues = {
    "burnaccel": $('#burn-accel'),
    "burndist": $('#burn-dist'),
    "burnexhaust": $('#burn-exhaust'),
    "burnshipmass": $('#burn-ship-mass')
  }

  var burnConsts = {
    "gms2": 9.8,
    "aum": 149600000000,
    "cms": 3.00E+08
  }

  var burnOutputFields = {
    "accel": $('#accel-result'),
    "earthdist": $('#earthdist-result'),
    "earthtime": $('#earthtime-result'),
    "maxspeed": $('#maxspeed-result'),
    "maxrapidity": $('#maxrapidity-result'),
    "propertime": $('#propertime-result'),
  }

  var burnTotalFields = {
    "fueluse": $("#fueluse-result"),
  }

  for (var variable in burnInputValues) {
    // get input values
    burnInputValues[variable] = parseFloat($(burnInputValues[variable]).val());
    // debug(variable,burnInputValues[variable] + ' - ' + typeof burnInputValues[variable]);
  }
  var accel = (burnInputValues['burnaccel']*burnConsts['gms2'])/Math.pow(burnConsts['cms'], 2);
  var earthdist = burnConsts['aum']*burnInputValues['burndist'];
  var earthtime = Math.sqrt(Math.pow(earthdist, 2)+4*earthdist/accel)/burnConsts['cms'];
  var maxspeed = accel*earthtime*burnConsts['cms']/(2+earthdist*accel);
  var maxrapidity = Math.atan(maxspeed);
  var propertime = 2*maxrapidity/accel / burnConsts['cms'];

  var fueluse = burnInputValues['burnshipmass']*(Math.exp(burnConsts['cms']*accel*propertime/burnInputValues['burnexhaust'])-1);

  $(burnOutputFields['accel']).val(round(accel, 'small'));
  $(burnOutputFields['earthdist']).val(round(earthdist, 2));
  $(burnOutputFields['earthtime']).val(round(earthtime, 2));
  $(burnOutputFields['maxspeed']).val(round(maxspeed, 2));
  $(burnOutputFields['maxrapidity']).val(round(maxrapidity, 2));
  $(burnOutputFields['propertime']).val(round(propertime, 2));

  $(burnTotalFields['fueluse']).val(round(fueluse, 2));

  var TotalFuelRemaing = $('#fuel-mass').val() - fueluse

  $.ajax({
  url:'/api/v1/put/',
  type:'put',
  data:'rowId=fuelmass&fuelVal=' + round(TotalFuelRemaing, 2),
  success:function(){
    console.log('success');
  return false;
  }
  });

}

function debug(desc, input) {
  console.log(desc + ': ' + input);
}

function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    if (exp = 'small') {
      value = value.toString().split('e');
      value = round(value[0], 2) + 'e' + value[1];
      return value;
    } else {
      return NaN;
    }
  }

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

function diceRoll(number, min, max) {
    var diceRunningTotal = 0;
    // console.log("Rolling a D" + max);
	for (var numberOfRolls = 0; numberOfRolls < number; numberOfRolls++) {
		var aSingleDie = (Math.random() * ((max + 1) - min) + min);
		aSingleDie = Math.floor(aSingleDie);
		// console.log("You rolled a " + aSingleDie);
		diceRunningTotal += aSingleDie;
	}
	console.log("running total is " + diceRunningTotal);

return diceRunningTotal;

}
function timerFunc(time, repeat = false, elem, style, value, resetVal) {
  setTimeout(function() {
    $(elem).css(style, value);
    if (repeat) {
      timerFunc(time, repeat, elem, style, resetVal, value);
    }
  }, time);
}
function timerFuncRand(bool, val) {
  setTimeout(function() {
    $('#wrapper').css('filter', 'blur(' + val + ')');
    if (bool) {
      timerFunc(false, '0px');
    } else {
      timerFunc(true, '1px');
    }
  }, diceRoll(1,1000, 5000));
}
