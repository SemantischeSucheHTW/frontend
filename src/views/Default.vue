<template>
    <b-container class="container">
        <h1>Willkommen zur Polizeiberichtsuche Berlin</h1>
        <b-input-group size="lg" prepend="Freie Suche:">
            <b-form-input v-model.trim="queryText"
                          placeholder="Suchbegriffe eingeben ..."
            ></b-form-input>
            <b-input-group-append>
                <b-btn v-b-toggle.options v-b-tooltip.hover title="Legen Sie Zeitraum und Ort fest" variant="secondary">
                    ⚙ Suche eingrenzen
                </b-btn>
            </b-input-group-append>
        </b-input-group>
        <b-collapse id="options" class="mt-2">
            <b-card bg-variant="light">
                <b-form-group horizontal
                              breakpoint="lg"
                              label="Suche eingrenzen"
                              label-size="lg"
                              label-class="font-weight-bold pt-0"
                              class="mb-0">
                    <b-input-group>
                        <b-input-group-prepend is-text>
                            <input class="mr-sm-2" type="checkbox" v-model="fromActive"> Von:
                        </b-input-group-prepend>
                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0"
                                      v-model="fromDate"
                                      type="date"
                                      :state="fromDateState"
                                      :readonly="!fromActive"
                                      id="selectFromDate"
                                      aria-describedby="fromDateLiveFeedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="fromDateLiveFeedback">
                            Bitte ein valides Datum eingeben.
                        </b-form-invalid-feedback>
                    </b-input-group>
                    <b-input-group class="mt-2">
                        <b-input-group-prepend is-text>
                            <input class="mr-sm-2" type="checkbox" v-model="toActive"> Bis:
                        </b-input-group-prepend>
                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0"
                                      v-model="toDate"
                                      type="date"
                                      :readonly="!toActive"
                                      :state="toDateState"
                                      id="selectFromDate"
                                      aria-describedby="toDateLiveFeedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="toDateLiveFeedback">
                            Bitte ein valides Datum eingeben.
                        </b-form-invalid-feedback>
                    </b-input-group>
                    <b-form-group class="mt-2" label="Bezirke:">
                        <b-form-checkbox-group id="districts" name="districts" v-model="selectedDistricts"
                                               :options="districts">
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-form-group>
            </b-card>
        </b-collapse>
        <div class="mt-2 mb-2" v-show="activeCorrections.length > 0">
            <h5>Rechtschreibkorrektur:</h5>
            <ul v-for="correction in activeCorrections" style="list-style-type: none;" class="mb-0">
                <li v-for="suggestion in correction.suggestions">
                    <b-link v-b-tooltip.hover title="übernehmen" v-on:click="applyCorrection(correction.word, suggestion)">
                        {{correction.word}} → {{suggestion}}
                    </b-link>
                </li>
            </ul>
        </div>
        <b-row class="mt-2">
            <b-col>
                <b-button size="lg" variant="primary" @click="getReports">
                    🔎 Suchen
                </b-button>
            </b-col>
            <b-col style="text-align: right">
                <b-form-group class="pt-2">
                    <b-form-radio-group id="sortAlgo" name="sortAlgo" v-model="selectedSortAlgo"
                                        :options="sortAlgo">
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
        </b-row>
        <ul v-if="results.length > 0" class="mt-3 pl-2 pr-2 pt-2 pb-2" style="list-style-type: none;">
            <li v-for="result in results" class="mb-2">
                <SearchResult :result="result"></SearchResult>
            </li>
        </ul>
        <b-alert :show="!(!error)" dismissible variant="danger">
            {{error}}
        </b-alert>
    </b-container>
</template>

<script>
    import http from '../core/http';
    import SearchResult from '@/components/SearchResult.vue'

    export default {
        name: 'Default',
        components: {
            SearchResult: SearchResult
        },
        computed: {
            fromDateState() {
                return this.fromActive ? /^[0-9]{4}.[0-9]{2}.[0-9]{2}$/.test(this.fromDate) : null
            },
            toDateState() {
                return this.toActive ? /^[0-9]{4}.[0-9]{2}.[0-9]{2}$/.test(this.toDate) : null
            },
            activeCorrections() {
                return this.corrections.filter(value => this.queryText.toLowerCase().includes(value.word));
            }
        },
        data() {
            return {
                fromDate: 'dd.mm.yyyy',
                fromActive: false,
                toDate: 'dd.mm.yyyy',
                toActive: false,
                districts: ['Charlottenburg-Wilmersdorf',
                    'Friedrichshain-Kreuzberg',
                    'Lichtenberg',
                    'Marzahn-Hellersdorf',
                    'Mitte',
                    'Neukölln',
                    'Pankow',
                    'Reinickendorf',
                    'Spandau',
                    'Steglitz-Zehlendorf',
                    'Tempelhof-Schöneberg',
                    'Treptow-Köpenick',
                    'berlinweit',
                    'bezirksübergreifend',
                    'bundesweit'],
                selectedDistricts: [],
                sortAlgo: [
                    {text: 'Word 2 Vec', value: 'w2v'},
                    {text: 'TF-IDF', value: 'tfidf'}
                ],
                selectedSortAlgo: 'w2v',
                queryText: '',
                fullQuery: new URLSearchParams(),
                error: false,
                results: [
                ],
                corrections: [
                    {
                        word: 'was',
                        suggestions: ['das', 'krass']
                    },
                    {
                        word: 'geht',
                        suggestions: ['gehen']
                    }
                ]
            }
        },
        methods: {
            getReports() {

                this.fullQuery = new URLSearchParams();

                this.fullQuery.append('sortAlg', this.selectedSortAlgo);

                if (!(!this.queryText || 0 === this.queryText.length))
                    this.fullQuery.append('q', this.queryText.split(' ').join('+'));

                if (this.fromDateState) {
                    this.fullQuery.append('from', this.fromDate);
                    if(!this.toDateState) {
                        const now = new Date();
                        const nowFormatted = now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1 < 10 ? '0' + (now.getUTCMonth() + 1) : (now.getUTCMonth()) + 1) + '-' + now.getUTCDate();
                        this.fullQuery.append('to', nowFormatted)
                    }
                }

                if (this.toDateState)
                    this.fullQuery.append('to', this.toDate);

                if (this.selectedDistricts.length > 0)
                    this.fullQuery.append('districts', this.selectedDistricts.join('+'));

                http.get(process.env.VUE_APP_REPORTS_BASE_URL, {
                    params: this.fullQuery
                }).then(response => {
                    this.error = false;
                    this.results = response.data;
                }).catch(error => {
                    this.error = error;
                });
            },
            getCorrections() {
                http.get(process.env.VUE_APP_CORRECTIONS_BASE_URL + '?query=' + this.queryText.split(' ').join('+'))
                    .then(response => {
                        this.corrections = response.data;
                    }).catch(error => {
                        this.error = error
                });
            },
            applyCorrection(word, correction) {
                this.queryText = this.queryText.toLowerCase().replace(word, correction);
            }
        },
        watch: {
            queryText: function () {
                this.getReports();
                this.getCorrections();
            },
            fromDate: function () {
                this.getReports();
            },
            toDate: function () {
                this.getReports();
            },
            selectedDistricts: function () {
                this.getReports();
            },
            selectedSortAlgo: function () {
                this.getReports();
            }
        }
    }
</script>

<style scoped="true">
    .container {
        margin-top: 30px;
    }
</style>