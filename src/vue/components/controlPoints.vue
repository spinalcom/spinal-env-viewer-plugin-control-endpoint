<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
	<div class="control-point-table">
		<!-- <div class="table"> -->
		<md-table class="table" v-model="searched">
			<md-table-empty-state
				md-label="No control point found"
				:md-description="`No control point found.`"
			>
			</md-table-empty-state>

			<md-table-row
				v-if="!editMode"
				slot="md-table-row"
				slot-scope="{ item }"
			>
				<md-table-cell md-label="Name">
					{{ item.name }}
				</md-table-cell>

				<md-table-cell md-label="Alias">
					{{ item.alias }}
				</md-table-cell>

				<md-table-cell md-label="DataType">
					{{ controlPointDataType[item.dataType] }}
				</md-table-cell>

				<md-table-cell md-label="Endpoint Type">
					{{ item.type }}
				</md-table-cell>

				<!-- <md-table-cell md-label="Endpoint Icon">
          <md-icon :title="item.icon">{{item.icon}}</md-icon>
        </md-table-cell> -->

				<md-table-cell md-label="Unit">
					{{ item.unit || "-" }}
				</md-table-cell>

				<md-table-cell md-label="Command">
					{{ boolValues[item.command] || "No" }}
				</md-table-cell>

				<md-table-cell md-label="Save TimeSeries">
					{{ boolValues[item.saveTimeSeries] || "No" }}
				</md-table-cell>

				<!-- <md-table-cell>
          <md-button class="md-icon-button md-primary"
                     @click="configureColor(item)">
            <md-icon>settings</md-icon>
          </md-button>
        </md-table-cell>

        <md-table-cell v-if="editMode">
          <md-button class="md-icon-button md-accent">
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell> -->
			</md-table-row>

			<!--
      //////////////////////////////////// 
      //  Edit Mode 
      //////////////////////////////////// 
      -->

			<md-table-row v-else slot="md-table-row" slot-scope="{ item }">
				<md-table-cell class="tableCell" md-label="Name">
					<md-field md-inline>
						<label>Name</label>
						<md-input v-model="item.name"></md-input>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell" md-label="Alias">
					<md-field md-inline>
						<label>Alias</label>
						<md-input v-model="item.alias"></md-input>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell" md-label="DataType">
					<md-field md-inline>
						<label for="command">dataType</label>
						<md-select
							v-model="item.dataType"
							name="dataType"
							id="dataType"
							@md-selected="selectDataType(item)"
						>
							<md-option
								v-for="(type, index) in Object.keys(
									controlPointDataType
								)"
								:value="type"
								:key="index"
							>
								{{ controlPointDataType[type] }}
							</md-option>
						</md-select>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell" md-label="Endpoint Type">
					<md-field md-inline>
						<label for="command">type</label>
						<md-select v-model="item.type" name="type" id="type">
							<md-option
								v-for="(type, index) in Object.keys(endpointTypes)"
								:value="type"
								:key="index"
							>
								{{ endpointTypes[type] }}
							</md-option>
						</md-select>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell" md-label="Unit">
					<md-field md-inline>
						<label>Unit</label>
						<md-input v-model="item.unit"></md-input>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell" md-label="Command">
					<md-field md-inline>
						<label for="command">Command</label>
						<md-select v-model="item.command" name="command" id="command">
							<md-option :value="1">Yes</md-option>
							<md-option :value="0">No</md-option>
						</md-select>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell" md-label="Save TimeSeries">
					<md-field md-inline>
						<label for="saveTimeSeries">TimeSeries</label>
						<md-select
							v-model="item.saveTimeSeries"
							name="saveTimeSeries"
							id="saveTimeSeries"
						>
							<md-option :value="1">Yes</md-option>
							<md-option :value="0">No</md-option>
						</md-select>
					</md-field>
				</md-table-cell>

				<md-table-cell class="tableCell">
					<md-button
						class="md-icon-button md-primary"
						:disabled="disableConfig(item)"
						@click="configureColor(item)"
					>
						<md-icon>settings</md-icon>
					</md-button>
				</md-table-cell>

				<md-table-cell class="tableCell">
					<md-button
						class="md-icon-button md-accent"
						@click="removeItem(item.id)"
					>
						<md-icon>delete</md-icon>
					</md-button>
				</md-table-cell>
			</md-table-row>
		</md-table>
		<!-- </div> -->

		<div class="fabs" v-if="editMode">
			<md-button
				class="md-fab md-mini md-primary"
				title="add controlPoint"
				@click="addControlPoint"
			>
				<md-icon>add</md-icon>
			</md-button>

			<md-button
				class="md-fab md-mini md-accent"
				title="cancel"
				@click="cancel"
			>
				<md-icon>close</md-icon>
			</md-button>

			<md-button
				class="md-fab md-mini md-primary"
				title="confirm"
				@click="valid"
			>
				<md-icon>check</md-icon>
			</md-button>
		</div>
	</div>
</template>

<script>
	import {
		ControlPointObj,
		ControlEndpointDataType,
		getConfig,
		ControlEndpointType,
	} from "spinal-env-viewer-plugin-control-endpoint-service";

	import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

	export default {
		name: "controlPointComponent",
		props: {
			data: {
				default: [],
			},
			editMode: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			this.controlPointDataType = ControlEndpointDataType;
			this.endpointTypes = ControlEndpointType;

			// this.endpointDataType = ControlEndpointType;

			this.boolValues = {
				1: "Yes",
				0: "No",
			};
			return {
				searched: [],
				// endpointTypes: [],
			};
		},
		mounted() {
			this.searched = JSON.parse(JSON.stringify(this.data));
			// this.endpointTypes = Object.keys(InputDataEndpointType).filter(
			//   (el) => !isNaN(el)
			// );

			// this.dataTypesValues = Object.keys(ControlEndpointDataType);
		},
		methods: {
			createControlPoint() {
				this.$emit("create");
			},

			addControlPoint() {
				const controlPoint = Object.assign({}, ControlPointObj);
				controlPoint.id = Date.now();

				this.searched = [...this.searched, controlPoint];
			},

			removeItem(id) {
				this.searched = this.searched.filter((el) => el.id !== id);
			},

			configureColor(item) {
				spinalPanelManagerService.openPanel("configurationDialog", {
					item: JSON.parse(JSON.stringify(item)),
					callback: (config) => {
						item.config = config;
					},
				});
			},

			cancel() {
				this.searched = JSON.parse(JSON.stringify(this.data));
				this.$emit("cancel");
			},

			valid() {
				const validItems = this.getValidRow();

				if (validItems.length === 0) return alert("no control point valid");

				if (validItems.length === this.searched.length) {
					this.$emit("confirm", validItems);
				} else if (validItems.length < this.searched.length) {
					const diff = this.searched.length - validItems.length;
					const valid = window.confirm(
						`${diff} control points is/are not valid and will be deleted, will you continue ?`
					);

					if (valid) {
						this.$emit("confirm", validItems);
					}
				}
			},

			selectDataType(item) {
				const config = getConfig(item.dataType);
				if (config) {
					item.config = config;
				}
			},

			getValidRow() {
				return this.searched.filter((item) =>
					this.controlPointIsValid(item)
				);

				// const filtered = this.searched.filter((item) =>
				//   this.controlPointIsValid(item)
				// );
				// return filtered.map((el) => {
				//   if (!isNaN(el.type)) {
				//     el.type = InputDataEndpointType[el.type];
				//   }
				//   return el;
				// });
			},

			isNotValid() {
				const found = this.searched.find((el) =>
					this.controlPointIsValid(el)
				);
			},

			controlPointIsValid(controlPoint) {
				return (
					controlPoint.name.trim().length > 0 &&
					controlPoint.alias.trim().length > 0 &&
					controlPoint.dataType.trim().length
				);
			},

			disableConfig(item) {
				return (
					[
						ControlEndpointDataType.Float,
						ControlEndpointDataType.Integer,
						ControlEndpointDataType.Integer16,
						ControlEndpointDataType.Real,
						ControlEndpointDataType.Double,
						ControlEndpointDataType.Long,
						ControlEndpointDataType.Boolean,
						ControlEndpointDataType.Enum,
					].indexOf(item.dataType) === -1
				);
			},
		},
		watch: {
			data() {
				this.searched = JSON.parse(JSON.stringify(this.data));
			},
		},
	};
</script>

<style scoped>
	.control-point-table {
		width: 100%;
		height: calc(100% - 10px);
		display: flex;
		flex-direction: column;
	}

	.control-point-table .fabs {
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: flex-end;

		/* bottom: 5px;
   right: 5px; */
		/* position: absolute; */
		/* background-color: red; */
	}

	.control-point-table .table {
		/* width: 100%; */
		height: calc(100% - 50px);
		overflow: hidden;
	}
</style>

<style>
	.control-point-table .table .md-content.md-table.md-theme-default {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.control-point-table
		.table
		.md-content.md-table-content.md-scrollbar.md-theme-default {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.control-point-table .table .tableCell .md-field {
		min-height: unset;
	}
</style>
