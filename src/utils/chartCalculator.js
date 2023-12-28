import { Origin, Horoscope } from "circular-natal-horoscope-js";
import {planetPositionAnalysis, analyze_BM, analyze_lords} from './dignities_scheme.js'
export function calculateChart(birthTime, location) {
  // Placeholder logic - replace with actual astrology chart calculation
	//////////
	// Origin
	//////////
	// This class automatically derives the local timezone from latitude/longitude coordinates
	// and calculates UTC time with respect to timezone and historical daylight savings time.
	// Only works for C.E. date (> 0).
	/////////
	// * int year: value >= 0 C.E.
	// * int month: (0 = january ...11 = december)
	// * int date: (1...31)
	// * int hours = local time - hours value (0...23)
	// * int minute = local time - minute value (0...59)
	// * float latitude = latitude in decimal format (-90.00...90.00)
	// * float longitude = longitude in decimal format (-180.00...180.00)

	// December 1st, 2020 - 430pm

	const origin = new Origin({
		year: 1995,
		month: 9, // 0 = January, 11 = December!
		date: 30,
		hour: 1,
		minute: 30,
		latitude: 29.29,
		longitude: 121.42,
	});
  // for bonification and maltreatment
  const customOrbs = {
      conjunction: 3,  // use for adherence
      opposition: 3, // for striking with a ray
      trine: 8,
      square: 3,  // use for striking with a ray
      sextile: 6
    };

	const horoscope = new Horoscope({
      origin: origin,
      houseSystem: "whole-sign",
      zodiac: "tropical",
      aspectPoints: ['bodies'],
      aspectWithPoints: ['bodies', 'points', 'angles'],
      aspectTypes: ["conjunction",'opposition','square'],
      customOrbs: customOrbs,
      language: 'en'
    });
  var planet_list = ['jupiter','mars','mercury','moon','neptune','pluto','saturn','sun','uranus','venus']
  var planetPositions = [];
  planet_list.forEach(function(planet) {
    planetPositions.push({
      'planet': planet,
      'degrees': horoscope.CelestialBodies[planet].ChartPosition.Ecliptic.ArcDegreesFormatted30, // Assuming horoscope.degrees is defined elsewhere
    	'house': horoscope.CelestialBodies[planet].House.id,
    	'sign': horoscope.CelestialBodies[planet].Sign.key
    });
  });
  // ascendant degree and sign
  var ascPosition = {
    'degrees': horoscope.Ascendant.ChartPosition.Ecliptic.ArcDegreesFormatted30, // Assuming horoscope.degrees is defined elsewhere
  	'sign': horoscope.Ascendant.Sign.key
   };
  var newPlanetPositions = planetPositionAnalysis(planetPositions,ascPosition)
  var mal, bon = analyze_BM(newPlanetPositions, horoscope.Aspects)
  var lords = analyze_lords(newPlanetPositions)
  console.log(lords)

  return {
    planets: [
      // Mock data
      { name: 'Planet1', position: [0, 0, 0] },
      { name: 'Planet2', position: [1, 1, 1] },
      // Add more planets or relevant data
    ]
  };
}
