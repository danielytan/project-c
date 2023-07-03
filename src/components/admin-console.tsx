import { html, css, LitElement } from 'lit';

class AdminConsole extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 80%;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
    }

    h1 {
      text-align: center;
    }

    .console-window {
      height: 600px;
      overflow-y: auto;
      background-color: #000;
      color: #fff;
      padding: 10px;
      border-radius: 4px;
      font-family: inherit; /* Use the parent font-family */
    }

    .console-window pre {
      margin: 0;
      color: #fff;
      background-color: transparent;
    }

    .input-line {
      display: flex;
      font-family: inherit; /* Use the parent font-family */
    }

    .input-line span {
      color: #fff;
    }

    .input-line form {
      flex: 1;
      margin-left: 5px;
    }

    .input-line input[type='text'] {
      width: 100%;
      background-color: transparent;
      color: #fff;
      border: none;
      outline: none;
      font-family: inherit; /* Use the parent font-family */
    }
  `;

  command = '';
  output = '';

  handleInputChange(event: { target: any; }) {
    const inputElement = event.target;
    this.command = inputElement.value;
  }

  handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    this.processCommand();
    this.command = '';
  
    // Clear the input field
    const inputElement = this.shadowRoot!.querySelector('input[type="text"]');
    if (inputElement instanceof HTMLInputElement) {
      inputElement.value = '';
    }
  }

  processCommand() {
    // Process the command and update the output
  
    this.output += '> ' + this.command + '\n';
    this.requestUpdate();
  
    // Scroll the console window to the bottom with a delay
    setTimeout(() => {
      const consoleWindow = this.shadowRoot!.querySelector('.console-window');
      if (consoleWindow) {
        consoleWindow.scrollTop = consoleWindow.scrollHeight;
      }
    }, 5);
  }

  render() {
    return html`
      <div class="console-window">
        <pre>${this.output}</pre>
        <div class="input-line">
          <span>&gt; </span>
          <form @submit="${this.handleSubmit}">
            <input
              type="text"
              .value="${this.command}"
              @input="${this.handleInputChange}"
              placeholder="Enter a command..."
              autofocus
            />
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('admin-console', AdminConsole);

export default AdminConsole