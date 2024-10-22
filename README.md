# 99dev Analytics

<!-- ![99dev logo](./public/99dev_banner.jpg) -->

**99dev** is a suite of no-frills web services designed for indie makers and small-scale projects. We offer simple and affordable tools, starting at just $1 a month. With **99dev Analytics**, you can track website metrics and interactions effortlessly. Start for free and pay as your needs grow.

## Getting Started

You can play around with 99dev analytics on the [demo page](https://demo.99.dev).

When you're ready to track your own sites, risk free, [create an account](https://app.99.dev/#/account-creation) and install the snippet using the instructions below.

## Installation

Install via npm:

```bash
npm install @99devco/analytics
```

Import into your project:

### ES Module

```javascript
import * as analytics from '@99devco/analytics';
```

### UMD

```javascript
const analytics = require('@99devco/analytics');
```

### Script or CDN

Install via CDN:

```html
<script src="https://cdn.99.dev/99dev.js"></script>
<script>
  const analytics = window.Analytics;
</script>
```

## Usage Example

You must initialize the package with your site's `uuid`. By default, this will record a page view. On a traditional static website, this is all you need.

```javascript
analytics.init("your-uuid-goes-here");
```

To use hash navigation, pass the `nav_type:"hash"` parameter and _watch_ the hash changes.

```javascript
analytics.init("your-uuid-goes-here", {nav_type:"hash").watch();
```

## Advanced Usage

See the [official 99dev documentation page](https://99.dev/docs/) for further details about supported metas, canonicals, etc.

## API

See this repository's Typescript definitions for details.

- **`init(uuid:string, options?:{})`**: Tracks when a page is viewed.

- **`recordView(url?:string, referrer?:string)`**: Tracks the current or specified page.

- **`watch(options?:{})`**: Monitors the specified navigation mechanism for changes.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please create an issue or submit a pull request.

## License

MIT License. See [LICENSE](./LICENSE) for more information.

## Support

If you have questions or need help, reach out to our support team or open an issue on GitHub.
