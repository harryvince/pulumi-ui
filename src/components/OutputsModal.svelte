<script>
  export let outputs = {};
  export let show = false;
  export let closeModal;
</script>

{#if show}
  <div class="modal-backdrop" on:click={closeModal}></div>
  <div class="modal">
    <h1>Resource Outputs</h1>
    <pre>{JSON.stringify(outputs, null, 2)}</pre>
    <button on:click={closeModal}>Close</button>
  </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10;
    }
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-background-color);
        padding: 1rem;
        border-radius: 8px;
        z-index: 20;
        width: 800px;
        max-width: 100%;
        max-height: calc(100% - 4rem);
        overflow-y: auto;
    }
    pre {
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
        padding: 1rem;
    }
</style>
