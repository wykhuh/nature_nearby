import { html } from "../../lib/component_utils";
import {
  renderDaysOptions,
  renderHoursOptions,
  renderYearsOptions,
  renderTrueFalseSelect,
  renderObscurationOptions,
  renderPresetDates,
} from "./render_utils";

const basicFields = html`
  <div class="fields-basic">
    <fieldset>
      <legend>Basic Search</legend>
      <div class="form-group">
        <label
          >Places
          <input id="search-places" type="text" autocomplete="off" />
        </label>
      </div>

      <div class="form-group">
        <button
          type="button"
          class="btn-primary"
          name="current-location"
          id="current-location"
        >
          Current location</button
        ><app-tooltip
          data-content="?"
          data-tooltip="Sets latitude and longitude using your current location."
        ></app-tooltip>
      </div>

      <div class="form-group">
        <label
          >Observed Dates
          <app-tooltip
            data-content="?"
            data-tooltip="Sets month and year for when the observations were observed. If you want more date options, use 'More Options > Date Observed'"
          ></app-tooltip>
          ${renderPresetDates()}
        </label>
      </div>

      <div class="form-group">
        <label for="unobserved-by-user-search"
          >Unobserved by user
          <app-tooltip
            data-content="?"
            data-tooltip="unobserved_by_user_id: Observations with taxon not previously observed by this user"
          ></app-tooltip>
        </label>
        <input id="search-unobserved-by-user" type="text" autocomplete="off" />
      </div>
    </fieldset>

    <fieldset>
      <legend>Species</legend>
      <div class="form-group">
        <label
          >Species
          <input id="search-taxa" type="text" autocomplete="off" />
        </label>
      </div>

      <div class="iconic_taxa_list">
        <div class="form-group">
          <input type="checkbox" id="Aves" value="Aves" name="iconic_taxa" />
          <label for="Aves">Birds</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Amphibia"
            value="Amphibia"
            name="iconic_taxa"
          />
          <label for="Amphibia">Amphibians</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Reptilia"
            value="Reptilia"
            name="iconic_taxa"
          />
          <label for="Reptilia">Reptiles</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Mammalia"
            value="Mammalia"
            name="iconic_taxa"
          />
          <label for="Mammalia">Mammals</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Actinopterygii"
            value="Actinopterygii"
            name="iconic_taxa"
          />
          <label for="Actinopterygii">Ray-finned Fishes</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Mollusca"
            value="Mollusca"
            name="iconic_taxa"
          />
          <label for="Mollusca">Mollusks</label>
        </div>

        <div class="form-group">
          <input
            type="checkbox"
            id="Arachnida"
            value="Arachnida"
            name="iconic_taxa"
          />
          <label for="Arachnida">Arachnids</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Insecta"
            value="Insecta"
            name="iconic_taxa"
          />
          <label for="Insecta">Insects</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Plantae"
            value="Plantae"
            name="iconic_taxa"
          />
          <label for="Plantae">Plants</label>
        </div>
        <div class="form-group">
          <input type="checkbox" id="Fungi" value="Fungi" name="iconic_taxa" />
          <label for="Fungi">Fungi</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="Protozoa"
            value="Protozoa"
            name="iconic_taxa"
          />
          <label for="Protozoa">Protozoans</label>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            id="unknown"
            value="unknown"
            name="iconic_taxa"
          />
          <label for="unknown">Unknown</label>
        </div>
      </div>
    </fieldset>
  </div>
`;

let datePane = html`
  <div>
    <fieldset>
      <legend>Date Observed</legend>

      <div class="form-group range-start">
        <label for="d1"
          >Start Date
          <app-tooltip
            data-content="?"
            data-tooltip="d1: Observed on or after this date"
          ></app-tooltip>
        </label>
        <input type="date" name="d1" id="d1" />
      </div>

      <div class="form-group range-end">
        <label for="d2"
          >End Date
          <app-tooltip
            data-content="?"
            data-tooltip="d2: Observed on or before this date"
          ></app-tooltip>
        </label>
        <input type="date" name="d2" id="d2" />
      </div>

      <div class="form-group">
        <label for="hour"
          >Hours
          <app-tooltip
            data-content="?"
            data-tooltip="hour: Observed within this hour of the day"
          ></app-tooltip>
        </label>
        <select name="hour" id="hour" multiple>
          ${renderHoursOptions("All")}
        </select>
      </div>

      <div class="form-group">
        <label for="day"
          >Days
          <app-tooltip
            data-content="?"
            data-tooltip="day: Observed within this day of the month"
          ></app-tooltip>
        </label>
        <select name="day" id="day" multiple>
          ${renderDaysOptions("All")}
        </select>
      </div>

      <div class="form-group">
        <label for="month"
          >Months
          <app-tooltip
            data-content="?"
            data-tooltip="month: Observed within this month"
          ></app-tooltip>
        </label>
        <select name="month" id="month" multiple>
          <option value="">All</option>
          <option value="1">Janurary</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <div class="form-group multiselect">
        <label for="year"
          >Years
          <app-tooltip
            data-content="?"
            data-tooltip="year: Observed within this year"
          ></app-tooltip>
        </label>
        <select name="year" id="year" multiple>
          ${renderYearsOptions("All")}
        </select>
      </div>
    </fieldset>
  </div>
`;

let observationPane = html`
  <!--column 1-->
  <div>
    <fieldset>
      <legend>Observation Status</legend>

      <div class="form-group">
        <label for="captive"
          >Captive
          <app-tooltip
            data-content="?"
            data-tooltip="captive: Captive or cultivated observations"
          ></app-tooltip>
        </label>
        ${renderTrueFalseSelect("captive", "captive")}
      </div>

      <div class="form-group multiselect">
        <label for="quality_grade"
          >Quality Grade
          <app-tooltip
            data-content="?"
            data-tooltip="quality_grade: Observations have this quality grade"
          ></app-tooltip>
        </label>
        <select id="quality_grade" name="quality_grade" multiple>
          <option value="">All</option>
          <option value="research">Research Grade</option>
          <option value="needs_id">Needs Id</option>
          <option value="casual">Casual</option>
        </select>
      </div>

      <div class="form-group">
        <label for="verifiable">
          Verifiable
          <app-tooltip
            data-content="?"
            data-tooltip="verifiable: Observations with a quality_grade of either needs_id or research.
            Equivalent to quality_grade=needs_id,research."
          ></app-tooltip>
        </label>
        <!--do not use renderTrueFalseSelect since we want to set true as selected -->
        <select id="verifiable" name="verifiable">
          <option value=""></option>
          <option value="true" selected>True</option>
          <option value="false">False</option>
        </select>
      </div>
    </fieldset>
  </div>
  <!--column 2-->
  <div>
    <fieldset>
      <legend>Geospatial</legend>

      <div class="form-group">
        <label for="lat"
          >Latitude
          <app-tooltip
            data-content="?"
            data-tooltip="lat: Observation latitude"
          ></app-tooltip>
        </label>
        <input id="lat" name="lat" type="text" />
      </div>
      <div class="form-group">
        <label for="lng"
          >Longitude
          <app-tooltip
            data-content="?"
            data-tooltip="lng: Observation longitude"
          ></app-tooltip
        ></label>
        <input id="lng" name="lng" type="text" />
      </div>

      <div class="form-group">
        <label for="radius"
          >Radius
          <app-tooltip
            data-content="?"
            data-tooltip="radius: Draws a circle with a certain radius from your current location."
          ></app-tooltip
        ></label>
        <select name="radius" id="radius">
          <option></option>
          <option value=".1">328.1 ft (100 m)</option>
          <option value=".2">656.2 ft (200 m)</option>
          <option value=".4">1,312.3 feet (400 m)</option>
          <option value=".8">0.5 mi (.8 km)</option>
          <option value="1.6">1 mi (1.6 km)</option>
          <option value="4">2.5 mi (4.0 km)</option>
          <option value="8">5 mi (8.0 km)</option>
          <option value="16.1">10 mi (16.1 km)</option>
        </select>
      </div>

      <div class="form-group">
        <label for="obscuration"
          >Obscuration<app-tooltip
            data-content="?"
            data-tooltip="obscuration: Observations have geoprivacy or taxon_geoprivacy fields matching these values"
          ></app-tooltip
        ></label>
        <select name="obscuration" id="obscuration" multiple>
          ${renderObscurationOptions("All")}
        </select>
      </div>
    </fieldset>
  </div>

  <!--column 3-->
  <div>
    <fieldset>
      <legend>Media</legend>
      <div class="form-group">
        <label for="sounds"
          >Has Sounds
          <app-tooltip
            data-content="?"
            data-tooltip="sounds: Observations with sounds"
          ></app-tooltip>
        </label>
        ${renderTrueFalseSelect("sounds", "sounds")}
      </div>
      <div class="form-group">
        <label for="photos"
          >Has Photos
          <app-tooltip
            data-content="?"
            data-tooltip="photos: Observations with photos"
          ></app-tooltip>
        </label>
        ${renderTrueFalseSelect("photos", "photos")}
      </div>
    </fieldset>
  </div>
`;

const speciesPane = html`
  <fieldset>
    <legend>Species Status</legend>

    <div class="form-group">
      <label for="introduced"
        >Introduced
        <app-tooltip
          data-content="?"
          data-tooltip="introduced: Observations whose taxa are introduced in their location"
        ></app-tooltip>
      </label>
      ${renderTrueFalseSelect("introduced", "introduced")}
    </div>
    <div class="form-group">
      <label for="native"
        >Native
        <app-tooltip
          data-content="?"
          data-tooltip="native: Observations whose taxa are native to their location"
        ></app-tooltip>
      </label>
      ${renderTrueFalseSelect("native", "native")}
    </div>
    <div class="form-group">
      <label for="endemic"
        >Endemic
        <app-tooltip
          data-content="?"
          data-tooltip="endemic: Observations whose taxa are endemic to their location"
        ></app-tooltip>
      </label>
      ${renderTrueFalseSelect("endemic", "endemic")}
    </div>
  </fieldset>
`;

const nonEditablePane = html` <fieldset class="hidden">
  <legend>Fields that can't be changed</legend>
  <div class="form-group ">
    <label for="spam"
      >Spam
      <app-tooltip
        data-content="?"
        data-tooltip="spam: Observations marked as spam."
      ></app-tooltip
    ></label>
    <input id="spam" disabled />
  </div>
  <div class="form-group ">
    <label for="license"
      >License
      <app-tooltip
        data-content="?"
        data-tooltip="license: Observation have this license."
      ></app-tooltip
    ></label>
    <input id="license" disabled />
  </div>
  <div class="form-group ">
    <label for="photo_license"
      >Sound License
      <app-tooltip
        data-content="?"
        data-tooltip="photo_license: Observations have at least one photo with this license."
      ></app-tooltip
    ></label>
    <input id="photo_license" disabled />
  </div>

  <div class="form-group ">
    <label for="order_by"
      >Order By
      <app-tooltip
        data-content="?"
        data-tooltip="order_by: Attribute to sort on."
      ></app-tooltip
    ></label>
    <input id="order_by" disabled />
  </div>

  <div class="form-group ">
    <label for="order"
      >Order
      <app-tooltip
        data-content="?"
        data-tooltip="order: Sort order."
      ></app-tooltip
    ></label>
    <input id="order" disabled />
  </div>

  <div class="form-group">
    <label for="place_id"
      >Places
      <input id="place_id" name="place_id" type="text" disabled />
    </label>
  </div>
  <div class="form-group">
    <label for="taxon_id"
      >Species
      <input id="taxon_id" name="taxon_id" type="text" disabled />
    </label>
  </div>
  <div class="form-group">
    <label for="unobserved_by_user_id"
      >Unobserved by User
      <input
        id="unobserved_by_user_id"
        name="unobserved_by_user_id"
        type="text"
        disabled
      />
    </label>
  </div>
</fieldset>`;

export const template = html`
  <ol class="filters-list"></ol>
  <ol class="more-filters-list hidden"></ol>

  <form id="observations-form">
    <section class="options-container">
      ${basicFields}
      <div class="controls">
        <button type="button" class="btn-primary" id="more-options">
          More Options
        </button>
        <button class="btn-danger" type="reset">Reset</button>
      </div>
    </section>
    <section id="more-options-container" class="hidden">
      <div>${observationPane}</div>
      <div>${datePane}${speciesPane}${nonEditablePane}</div>
    </section>
  </form>
`;
