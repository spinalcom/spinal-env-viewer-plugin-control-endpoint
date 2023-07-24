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
	<md-dialog
		class="mdDialogContainer"
		:md-active.sync="showDialog"
		@md-closed="closeDialog(false)"
	>
		<md-dialog-title class="dialogTitle">
			Link Controlpoint To
		</md-dialog-title>

		<md-dialog-content class="content">
			<md-field>
				<label for="type">Link controlpoint to all</label>
				<md-select v-model="type" name="type" id="type">
					<md-option v-for="t in types" :key="t" :value="t">
						{{ t }}
					</md-option>
				</md-select>
			</md-field>
		</md-dialog-content>

		<md-dialog-actions>
			<md-button class="md-primary" @click="closeDialog(false)">
				Cancel
			</md-button>

			<md-button
				class="md-primary"
				:disabled="disabled()"
				@click="closeDialog(true)"
			>
				Save
			</md-button>
		</md-dialog-actions>
	</md-dialog>
</template>

<script>
	import { SpinalGraphService } from "spinal-env-viewer-graph-service";
	import { GEOGRAPHIC_TYPES_ORDER } from "spinal-env-viewer-context-geographic-service/build/constants";

	export default {
		name: "dialogComponent",

		props: ["onFinised"],
		data() {
			this.contextId;
			this.nodeId;

			return {
				showDialog: true,
				types: [],
				type: "",
				callback: undefined,
			};
		},

		mounted() {},

		methods: {
			async opened({ type, callback }) {
				// this.contextId = contextId;

				// this.nodeId = nodeId;

				this.callback = callback;
				this.type = type;
				this.types = this.getTypes(type);
			},

			async removed(option) {
				if (option && typeof this.callback !== "undefined") {
					this.callback(this.type);
				}
				this.showDialog = false;
			},

			closeDialog(closeResult) {
				if (typeof this.onFinised === "function") {
					this.onFinised(closeResult);
				}
			},

			getTypes(type) {
				// const types = [];
				// await SpinalGraphService.findInContext(
				// 	contextId,
				// 	nodeId,
				// 	(node) => {
				// 		const type = node.getType.get();
				// 		if (types.indexOf(type) !== -1) types.push(type);
				// 		return true;
				// 	}
				// );

				// return types;

				const index = GEOGRAPHIC_TYPES_ORDER.indexOf(type);

				if (index === -1) return GEOGRAPHIC_TYPES_ORDER;

				return GEOGRAPHIC_TYPES_ORDER.slice(index);
			},

			disabled() {
				return this.type.length === 0;
			},
		},
	};
</script>

<style scoped>
	.mdDialogContainer {
		width: 300px;
		height: 250px;
	}

	.mdDialogContainer .dialogTitle {
		text-align: center;
	}
</style>
