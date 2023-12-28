// essential dignities
var planet_list = ['jupiter','mars','mercury','moon','neptune','pluto','saturn','sun','uranus','venus']
var traditional_planet_list = ['jupiter','mars','mercury','moon','saturn','sun','venus']
var domicile = {'jupiter':['pisces','sagittarius'],'mars':['aries','scorpio'],
'mercury':['gemini','virgo'],'moon':['cancer'],'saturn':['capricorn','aquarius'],
'sun':['Leo'],'venus':['libra','taurus']}

var rulership = {'aries':'mars','taurus':'venus','gemini':'mercury','cancer':'moon','leo':'sun',
'virgo':'mercury','libra':'venus','scorpio':'mars','sagittarius':'jupiter','capricorn':'saturn',
'aquarius':'saturn','pisces':'jupiter'}

var exaltation = {'jupiter':['cancer'],'mars':['capricorn'],
'mercury':['virgo'],'moon':['taurus'],'saturn':['libra'],
'sun':['aries'],'venus':['pisces']}

var detriment = {'jupiter':['virgo','gemini'],'mars':['libra','taurus'],
'mercury':['pisces','sagittarius'],'moon':['capricorn'],'saturn':['cancer','leo'],
'sun':['aquarius'],'venus':['aries','scorpio']}

var fall = {'jupiter':['capricorn'],'mars':['cancer'],
'mercury':['pisces'],'moon':['scorpio'],'saturn':['aries'],
'sun':['libra'],'venus':['virgo']}

// trplicity
var triplicity = {'day':{'jupiter':[''],'mars':[''],'mercury':[''],'moon':[''],'saturn':['gemini','libra','aquarius'],'sun':['aries','leo','sagittarius'],'venus':['taurus','virgo','capricorn','cancer','scorpio','pisces']},
				  'night':{'jupiter':['aries','leo','sagittarius'],'mars':['cancer','scorpio','pisces'],'mercury':['gemini','libra','aquarius'],'moon':['taurus','virgo','capricorn'],'saturn':[],'sun':[],'venus':[]}}

var triplicity_ruler = {'day':{'aries':'sun','taurus':'venus','gemini':'saturn','cancer':'venus','leo':'sun',
'virgo':'venus','libra':'saturn','scorpio':'venus','sagittarius':'sun','capricorn':'venus',
'aquarius':'saturn','pisces':'venus'}, 'night': {'aries':'jupiter','taurus':'moon','gemini':'mercury','cancer':'mars','leo':'jupiter',
'virgo':'moon','libra':'mercury','scorpio':'mars','sagittarius':'jupiter','capricorn':'moon',
'aquarius':'mercury','pisces':'mars'}}

// planet evaluation
var planet_judgment = {'day':{'jupiter':'very good','mars':'very bad','mercury':'neutral','moon':'neutral','saturn':'slightly bad','sun':'okay','venus':'slightly good'},
				  'night':{'jupiter':'slightly good','mars':'slightly bad','mercury':'neutral','moon':'okay','saturn':'very bad','sun':'neutral','venus':'very good'}}
// aspect evalution - in the context of rulership
var aspect_judgment = {'co-present':'entangled with','square':'supported by', 'sextile': 'excited by', 
	 				   'trine':'supported by', 'opposition': 'antagonized by', 'aversion': 'ignored by'}
// aspect evaluation - in the context of good/bad aspects
var aspect_judgment2 = {'square':'supported by', 'sextile': 'slightly supported by', 
	 				   'trine':'supported by', 'opposition': 'antagonized by'}

// helper functions
function convertToDecimal(degreesStr) {
    // Split the string into degrees, minutes, and seconds
    const parts = degreesStr.split(/[^\d\w]+/);
    const degrees = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1])/60;
    const seconds = parseFloat(parts[2])/3600;
    return degrees+minutes+seconds
}
function distance_to_house(house, distance) {
	var target = house+distance
	if (target>0) {
		target = target % 12
	} else if (target==0) {
		target = 12
	} else {
		target = 12+target
	}
	return target
}
function planets_in_house(planetPositions, house_list) {
	// find planets in certain houses
	var planet_list = [];
	for (let i = 0; i < planetPositions.length; i++) {
		if (house_list.includes(planetPositions[i].house)) {
			planet_list.push(planetPositions[i].planet)
		}
	}
	return planet_list
}
function check_dignity(planet, sign) {
	if (domicile[planet].includes(sign)) {
		return 'domicile'
	} else if (exaltation[planet].includes(sign)) {
		return 'exaltation'
	} else if (detriment[planet].includes(sign)) {
		return 'detriment'
	} else if (fall[planet].includes(sign)) {
		return 'fall'
	} else {
		return null
	}
}
function check_aspect(house1, house2) {
	var distance = Math.abs(house1-house2)
	if (distance==3 | distance==9) {
		return 'square'
	} else if (distance==0) {
		return 'co-present'
	} else if (distance==2 | distance==10) {
		return 'sextile'
	} else if (distance==4 | distance==8) {
		return 'trine'
	} else if (distance==6) {
		return 'opposition'
	} else {
		return 'aversion'
	}
}
/* 
export functions
*/
export const planetPositionAnalysis = (planetPositions, ascPosition) =>{
  for (let i = 0; i < planetPositions.length; i++) {
  	// convert degrees to decimals
  	var sign_degrees = convertToDecimal(planetPositions[i].degrees)
  	var tofirst_degrees = sign_degrees+(planetPositions[i].house-1)*30
  	var toasc_degrees = tofirst_degrees - convertToDecimal(ascPosition.degrees)
  	planetPositions[i]['degrees'] = sign_degrees
  	planetPositions[i]['toFirst_degrees'] = tofirst_degrees
  	planetPositions[i]['toAsc_degrees'] = toasc_degrees
   }
  return planetPositions
}

// bonification and maltreatment
export const analyze_BM = (planetPositions, aspects) => {
	// result arrays
	var maltreated = [];
	var bonified = [];
	// determine day or night. 7 - sun, 6 - saturn, 1 - mars, 0 - jupiter, 9 - venus
	var bad_houses = [2,6,8,12];
	var sect;
	var benefic;
	var malefic;
	if (planetPositions[7]['toAsc_degrees'] > 180) {
		sect = 'day';
		benefic = 0;
		malefic = 1;
	} else {
		sect = 'night';
		benefic = 9;
		malefic = 6;
	}

	var house_mal = [] // houses that are maltreated
	// overcoming. 
	house_mal.push(distance_to_house(planetPositions[malefic].house,3))
	// opposition (conditional on the malefic house)
	if (bad_houses.includes(planetPositions[malefic].house)) {
		house_mal.push(distance_to_house(planetPositions[malefic].house,6))
	}
	maltreated.concat(planets_in_house(planetPositions, house_mal));

	// adherence, opposition, square within 3 degrees
	var aspects_malefic = aspects.points[planetPositions[malefic].planet]
	if (aspects_malefic) {
		for (let k = 0; k < aspects_malefic.length; k++) {
			maltreated.push(aspects_malefic[k].point1Key)
		}
	}

	// bonification
	var house_bon = [] // houses that are bonified
	// overcoming. 
	house_bon.push(distance_to_house(planetPositions[benefic].house,3))
	bonified.concat(planets_in_house(planetPositions, house_bon));
	// adherence, square within 3 degrees
	var aspects_benefic = aspects.points[planetPositions[benefic].planet]
	if (aspects_benefic) {
		for (let k = 0; k < aspects_benefic.length; k++) {
			if (aspects_benefic[k].point1Key.aspectKey != 'opposition') {
				bonified.push(aspects_benefic[k].point1Key)
			}
		}
	}

	return maltreated, bonified
}

// planets' relationship to lords
export const analyze_lords = (planetPositions) => {
	// determine sect
	var sect;
	var	benefics = [0,9];
	var malefics = [1,6];
	if (planetPositions[7]['toAsc_degrees'] > 180) {
		sect = 'day';
	} else {
		sect = 'night';
	}
    // result array
	var planetLords = [];
	for (let i = 0; i < planetPositions.length; i++) {
		var is_traditional = traditional_planet_list.includes(planetPositions[i].planet)
		if (!is_traditional) {
			continue
		}
		var dignity = check_dignity(planetPositions[i].planet, planetPositions[i].sign)
		//lord relationships
		var dom_ruler = rulership[planetPositions[i].sign]
		var dom_ind = planet_list.indexOf(dom_ruler)
		var relation_dom = check_aspect(planetPositions[i].house,
										planetPositions[dom_ind].house)
		var trip_ruler = triplicity_ruler[sect][planetPositions[i].sign]
		var relation_trip = check_aspect(planetPositions[i].house,
										 planetPositions[planet_list.indexOf(trip_ruler)].house)
		// good aspects
		var good_aspects = []
		for (let b = 0; b < benefics.length; b++) {
			var benefic = benefics[b]
			var aspect = check_aspect(planetPositions[i].house,planetPositions[benefic].house)
			if (['sextile','trine','square'].includes(aspect)) {
				good_aspects.push('is ' + aspect_judgment2[aspect] + ' a ' + planet_judgment[sect][planetPositions[benefic].planet] + ' influence')
			}
		}

		// bad aspects
		var bad_aspects = []
		for (let m = 0; m < malefic.length; m++) {
			var malefic = malefics[m]
			var aspect = check_aspect(planetPositions[i].house,planetPositions[malefic].house)
			if (['opposition','square'].includes(aspect)) {
				bad_aspects.push('is ' + aspect_judgment2[aspect] + ' a ' + planet_judgment[sect][planetPositions[malefic].planet] + ' influence')
			}
		}

		// append results
		planetLords.push({'planet': planetPositions[i].planet,
						  'dignity': dignity,
						  'domicile ruler': dom_ruler,
						  'domicile judgment': 'is ' + aspect_judgment[relation_dom] +' a '+ planet_judgment[sect][dom_ruler] + ' domicile ruler',
						  'triplicity judgment': 'is ' + aspect_judgment[relation_trip] +' a '+ planet_judgment[sect][trip_ruler] + ' triplicity ruler',
						  'good influence': good_aspects,
						  'bad influence': bad_aspects
		})
	}
	return planetLords
}
