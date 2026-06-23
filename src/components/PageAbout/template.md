<script>
import img from '../../assets/images/search.jpg'
</script>

<app-header></app-header>

<main id="about-page" class="flow">

## About

Have you ever taken a walk or hike and wonder what kinds of animals and plants are in the area?

Nature Nearby is a website that allows people to discover the plants, animals, fungi, etc. that are present at a given location. The data and photos comes from [iNaturalist](https://www.inaturalist.org), a platform that encourages people to observe and identify living organisms.

The idea for this site came from Dane's post [Is an app to see the nearest observation wortwhile?](https://forum.inaturalist.org/t/is-an-app-to-see-the-nearest-observation-wortwhile/79594) on the iNaturalist forum.

## Instructions

### Search page

This site provides a few ways find the species for a given location.

1. **Select location**. There are four ways to select a location.
   1. If you want the site to update the location as you walk around an area, click "Track location". The app uses your device's GPS, WiFi, or celluar signals to determine your location. By default, the app creates a circular area with a radius of 1 mile (1.6 kilometer) from your current location. You can change the radius using "More Options" > "Geospatial" > "Radius".
   2. If you want to search for species near your current location, click the "Current Location" button. You need to click the button everytime you want to update your location. You can change the radius using "More Options" > "Geospatial" > "Radius".
   3. If you want search for species within a place, enter the place name in the "Places" search box. You can search for multiple places.
   4. If you want to search for species within a custom rectangular area, click the <icon-square></icon-square> icon in the upper left of the map. Click on the map to set one corner of the rectangle, move your cursor, and click the map to set the second corner of the rectangle.

2. **Select species.** By default, this site shows all species. You can search for a species by typing in the species name in "Species" search box. You can search for mutiple species. You can also select one or more of well known species.

3. **Select date.** By default, this site shows all dates. You can select species that were observed during a specific time period by selecting a date range from the "Observed Dates" dropdown. If you want more date options, use 'More Options" > "Date Observed".

4. **Select unobserved species.** If you have an iNaturalist acoount, and you want to see species you have not observed, enter your iNaturalist username for "Unobserved by user".

5. For more search options, click the "More Options" button.

[Here's a search](/?taxon_id=3&place_id=962&geolocation=current&radius=1.6&month=6&year=2024,2025,2026) for "birds" in "Los Angeles", with currrent location, and June 2024-2026 observed dates.

<img src="/images/search.jpg" width="300px">

Notes:

- The fields for your search query will be shown in green.
- Click the "x" for the green search fields to delete the search query.
- Click "Reset" button to delete all search queries.
- Click the layers icon in the upper right of the map to customize the map. You can select a basemap, and how the iNaturalist observations are displayed.

### Species page

Click "Species" in the top menu to see a list of species that match your search query.

Click on the observations links to view the observations for that species.

If you search for place by name, a badge will be shown in the upper right corner for species are marked as native (green N) or invasive (pink IN) by iNaturalist.

<img src="/images/species.jpg" width="300px">

### Observations page

Click "Observations" in the top menu to see a list of iNaturalist observations that match your search query.

Click on the observation image to show a popup with all the photos and sounds for the observation.

## Privacy

This site does not save or share your search queries, location information, site usage, or personal data.

## Technical Details

This site grabs data from the [iNaturalist v2 API](https://api.inaturalist.org/v2/docs/). The site uses observations and photos with "cc0", "cc-by", "cc-by-nc", "cc-by-sa", or "cc-by-nc-sa" license.

This site is built using JavaScript/TypeScript, custom web components, CSS, and HTML. I tried to keep third party library to a minimum. This site uses [Leaflet](https://leafletjs.com/) (maps) and[Autocomplete.js](https://tarekraafat.github.io/autoComplete.js/) (autocomplete search). I also wanted to keep costs low as possible so this is a static site that is hosted for free on Cloudflare Pages.

I did not use AI prompts or vibe coding to build this site.

### Links

- [Github Repo](https://github.com/wykhuh/nature_nearby)

</main>
