/*
 * @copyright 2019-2020 Gary Kim <gary@garykim.dev>
 *
 * @author Gary Kim <gary@garykim.dev>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		loadedFavs: false,
		loading: false,
		favFiles: [],
	},
	mutations: {
		loadedFavs(state, val) {
			state.loadedFavs = val
		},
		loading(state, val) {
			state.loading = val
		},
		favFiles(state, val) {
			state.favFiles = val
		},
	},
	actions: {
        /**
		 * Toggle the recommendations and fetch recommended files if required
		 * @async
		 * @param {Object} context the store context
		 * @param {boolean} enabled recommendations status
		 */
		async enabled(context, enabled) {
			context.commit('enabled', enabled)
			context.dispatch('fetchFavs')
		},
		/**
		 * Fetch recommendations and current enabled setting
		 * @async
		 * @param {Object} context the store context
		 * @param {boolean} [always] set to true to always get recommendations regardless of enabled setting
		 */
		async fetchFavs(context) {
			if (context.state.loadedFavs || context.state.loading) {
				return
			}
			this.commit('loading', true)
			const fetched = await OC.Files.getClient().getFilteredFiles(
                {
                    favorite: true
                }
            ).then(function(state,result){
                return result
            });
			if (fetched !==undefined) {
				for (var i =0 ;i<fetched.length;i=i+1){
					fetched[i].id = fetched[i].id.toString(); 
				}
				context.commit('favFiles', fetched)
				this.commit('loadedFavs', true)
			}
			this.commit('loading', false)
		},
	},
})
