# Angular Shoppe Demo

Angular Shoppe Demo is reference application that provides tips and tricks to using [FullStory](https://www.fullstory.com/) on [Angular](https://angular.io/) web applications.

## Getting started

You'll need [Node.js](nodejs.org) to run or modify the application.  Once you have node installed, then download or clone this repo.

Install and start the web app with the following commands.

```bash
cd angular-shoppe-demo
npm install
npm run start
```

You should see a *Compiled successfully* message.  Then open [http://localhost:4200](http://localhost:4200) in your browser.

## Adding FullStory to the app

If you have signed up for FullStory, add your `orgId` to the `src/environments/environment.ts` file. Your orgId can be found on the Settings page.  It'll be next to the `window['_fs_org']` variable in the snippet.  For more information, see [Install your recording snippet](https://help.fullstory.com/hc/en-us/articles/360020828233#Install).

## Using the app

The Shoppe is a super simple e-commerce application.  After starting the app:

- Browse the products on either the [home page](http://localhost:4200) or the [/products](http://localhost:4200/products) route.
- Use the **Add to Cart** button to add products to your shopping cart.
- Review your cart and then click the **Continue to Checkout** button.
- Fill out the form on the following page and click **Checkout**. The app won't record sensitive or personal information, but it will record your first and last name as well as your email address. Feel free to use some bogus info.

## Using FullStory with the app

Now that you've used the app, you have a session in FullStory. Head on over to FullStory [https://app.fullstory.com/login](https://app.fullstory.com/login).

Find your session or build a segment using the following event filters.

- `Clicked` `Text is exactly` **Add to Cart**
- `Visited URL` `is` `PATH` /cart
- `Visited URL` `is` `PATH` /checkout
- `Changed` `CSS Selector` #firstname
- `Visited URL` `is` `PATH` /thankyou

Check out a few sessions and explore the data to get a feel for how you'd use FullStory on your own app or site.

## Tips and tricks

- If you want to simulate different users, use a private or incognito window with the app.
- Use the [FullStory Browser SDK](https://github.com/fullstorydev/fullstory-browser-sdk) to easily load FullStory into your app or site. See `app.component.ts`.
- Add `fs-exclude` CSS classes to prevent recording of sensitive or personal information. See `checkout.component.html` and [Private by Default](https://help.fullstory.com/hc/en-us/articles/360044349073-FullStory-Private-by-Default).

## (Optional) Use the product catalog microservice

By default all products are served from the Angular Shoppe itself.  You can optionally enable the products microservice, which will return the product catalog as an AJAX service call.  This allows you to record API requests and responses, see the article [How do I enable Ajax Whitelisting](https://help.fullstory.com/hc/en-us/articles/360020828393-How-do-I-enable-Ajax-Whitelisting-).

To enable the remote catalog:

- Clone and start the [api-shoppe-demo](https://github.com/fullstorydev/api-shoppe-demo) app.
- Update the `useMockApi` to be `false` in `environment.ts`.
- Revisit the [home page](http://localhost:4200) or the [/products](http://localhost:4200/products) route.
