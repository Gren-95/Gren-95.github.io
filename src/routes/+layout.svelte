<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<!-- Grain sits behind the content, never over it. An overlay above text makes
     its contrast auditable at rendered values and is the usual way this goes
     wrong; behind the text it only tints the ground, which is measurable. -->
<div class="grain" aria-hidden="true"></div>

{@render children()}
