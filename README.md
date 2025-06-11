# 99dev Analytics

![99dev logo](./images/99dev_logo_350x183.jpg)

**99dev** provides privacy and security focused web traffic analytics for only $1 per month. No pricing tiers, no fenced off premium features, and no misleading fractional pricing. Pay for what you use and _only_ what you use. No charge for up to 5 months.

## Getting Started

You can play around with 99dev analytics on the [live demo page](https://demo.99.dev).

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
<script src="https://cdn.99.dev/analytics.js"></script>
<script>
  const analytics = window.nndev;
</script>
```

## Basic Usage Example

You must initialize the package with your site's `uuid`. By default, this will record a page view. On a traditional static website, this is all you need.

```javascript
analytics.init("your-uuid-goes-here");
```

To use hash navigation, pass the `navType:"hash"` parameter and _watch_ the hash changes.

```javascript
analytics.init({uuid:"your-uuid-goes-here", navType:"hash"}).watch();
```

## Advanced Usage

See the [official 99dev documentation page](https://99.dev/docs?umd_source=npmjs.com) for further details about cybersecurity, metas, canonicals, etc.

## API

The 99dev analytics snippet is built with Typescript and includes type definitions throughout.

- **`init(uuid:string, options?:{})`**: Tracks when a page is viewed.

- **`recordView(url?:string, referrer?:string)`**: Tracks the current or specified page.

- **`watch(options?:{})`**: Monitors the specified navigation mechanism for changes.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please create an issue or submit a pull request.

## License

MIT License. See [LICENSE](./LICENSE) for more information.

## Support

If you have questions or need help, reach out to our support team or open an issue on GitHub.
