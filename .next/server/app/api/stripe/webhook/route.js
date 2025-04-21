/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/stripe/webhook/route";
exports.ids = ["app/api/stripe/webhook/route"];
exports.modules = {

/***/ "(rsc)/./app/api/stripe/webhook/route.ts":
/*!*****************************************!*\
  !*** ./app/api/stripe/webhook/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   config: () => (/* binding */ config)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stripe */ \"(rsc)/./node_modules/stripe/esm/stripe.esm.node.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\n\nconst config = {\n    api: {\n        bodyParser: false\n    }\n};\nconst stripe = new stripe__WEBPACK_IMPORTED_MODULE_1__[\"default\"](process.env.STRIPE_SECRET_KEY);\nconst webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;\nasync function POST(req) {\n    console.log('➡️ Recebendo webhook da Stripe...');\n    try {\n        const buf = await req.arrayBuffer();\n        const body = Buffer.from(buf);\n        const sig = req.headers.get('stripe-signature');\n        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);\n        console.log('📦 Evento recebido:', event.type);\n        if (event.type === 'checkout.session.completed') {\n            const session = event.data.object;\n            console.log('Session recebida:', JSON.stringify(session, null, 2));\n            const subscriptionId = session.subscription;\n            if (!subscriptionId || typeof subscriptionId !== 'string') {\n                console.error('⚠️ Subscription ID não encontrado na session:', subscriptionId);\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: 'Subscription ID não encontrado'\n                }, {\n                    status: 400\n                });\n            }\n            const subscription = await stripe.subscriptions.retrieve(subscriptionId);\n            const userId = subscription.metadata.user_id;\n            const { error } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.from('subscriptions').insert([\n                {\n                    user_id: userId,\n                    stripe_customer: subscription.customer,\n                    stripe_subscription: subscription.id,\n                    price_id: subscription.items.data[0].price.id,\n                    status: subscription.status\n                }\n            ]);\n            if (error) {\n                console.error('Erro ao inserir no Supabase:', error.message);\n                throw new Error(error.message);\n            }\n            console.log('✅ Subscription salva com sucesso!');\n        }\n        return new Response(JSON.stringify({\n            received: true\n        }), {\n            status: 200\n        });\n    } catch (err) {\n        console.error('❌ Erro no webhook:', err.message);\n        return new Response(`Erro no webhook: ${err.message}`, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3N0cmlwZS93ZWJob29rL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXdEO0FBQzVCO0FBQ2M7QUFFbkMsTUFBTUcsU0FBUztJQUNwQkMsS0FBSztRQUNIQyxZQUFZO0lBQ2Q7QUFDRixFQUFFO0FBRUYsTUFBTUMsU0FBUyxJQUFJTCw4Q0FBTUEsQ0FBQ00sUUFBUUMsR0FBRyxDQUFDQyxpQkFBaUI7QUFDdkQsTUFBTUMsZ0JBQWdCSCxRQUFRQyxHQUFHLENBQUNHLHFCQUFxQjtBQUVoRCxlQUFlQyxLQUFLQyxHQUFnQjtJQUN6Q0MsUUFBUUMsR0FBRyxDQUFDO0lBRVosSUFBSTtRQUNGLE1BQU1DLE1BQU0sTUFBTUgsSUFBSUksV0FBVztRQUNqQyxNQUFNQyxPQUFPQyxPQUFPQyxJQUFJLENBQUNKO1FBQ3pCLE1BQU1LLE1BQU1SLElBQUlTLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO1FBRTVCLE1BQU1DLFFBQVFsQixPQUFPbUIsUUFBUSxDQUFDQyxjQUFjLENBQUNSLE1BQU1HLEtBQUtYO1FBRXhESSxRQUFRQyxHQUFHLENBQUMsdUJBQXVCUyxNQUFNRyxJQUFJO1FBRTdDLElBQUlILE1BQU1HLElBQUksS0FBSyw4QkFBOEI7WUFDL0MsTUFBTUMsVUFBVUosTUFBTUssSUFBSSxDQUFDQyxNQUFNO1lBRWpDaEIsUUFBUUMsR0FBRyxDQUFDLHFCQUFxQmdCLEtBQUtDLFNBQVMsQ0FBQ0osU0FBUyxNQUFNO1lBRS9ELE1BQU1LLGlCQUFpQkwsUUFBUU0sWUFBWTtZQUUzQyxJQUFJLENBQUNELGtCQUFrQixPQUFPQSxtQkFBbUIsVUFBVTtnQkFDekRuQixRQUFRcUIsS0FBSyxDQUFDLGlEQUFpREY7Z0JBQy9ELE9BQU9qQyxxREFBWUEsQ0FBQ29DLElBQUksQ0FBQztvQkFBRUQsT0FBTztnQkFBaUMsR0FBRztvQkFBRUUsUUFBUTtnQkFBSTtZQUN0RjtZQUVBLE1BQU1ILGVBQWUsTUFBTTVCLE9BQU9nQyxhQUFhLENBQUNDLFFBQVEsQ0FBQ047WUFFekQsTUFBTU8sU0FBU04sYUFBYU8sUUFBUSxDQUFDQyxPQUFPO1lBRTVDLE1BQU0sRUFBRVAsS0FBSyxFQUFFLEdBQUcsTUFBTWpDLG1EQUFRQSxDQUFDa0IsSUFBSSxDQUFDLGlCQUFpQnVCLE1BQU0sQ0FBQztnQkFDNUQ7b0JBQ0VELFNBQVNGO29CQUNUSSxpQkFBaUJWLGFBQWFXLFFBQVE7b0JBQ3RDQyxxQkFBcUJaLGFBQWFhLEVBQUU7b0JBQ3BDQyxVQUFVZCxhQUFhZSxLQUFLLENBQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDcUIsS0FBSyxDQUFDSCxFQUFFO29CQUM3Q1YsUUFBUUgsYUFBYUcsTUFBTTtnQkFDN0I7YUFDRDtZQUVELElBQUlGLE9BQU87Z0JBQ1RyQixRQUFRcUIsS0FBSyxDQUFDLGdDQUFnQ0EsTUFBTWdCLE9BQU87Z0JBQzNELE1BQU0sSUFBSUMsTUFBTWpCLE1BQU1nQixPQUFPO1lBQy9CO1lBRUFyQyxRQUFRQyxHQUFHLENBQUM7UUFDZDtRQUVBLE9BQU8sSUFBSXNDLFNBQVN0QixLQUFLQyxTQUFTLENBQUM7WUFBRXNCLFVBQVU7UUFBSyxJQUFJO1lBQ3REakIsUUFBUTtRQUNWO0lBQ0YsRUFBRSxPQUFPa0IsS0FBVTtRQUNqQnpDLFFBQVFxQixLQUFLLENBQUMsc0JBQXNCb0IsSUFBSUosT0FBTztRQUMvQyxPQUFPLElBQUlFLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRUUsSUFBSUosT0FBTyxFQUFFLEVBQUU7WUFBRWQsUUFBUTtRQUFJO0lBQ3ZFO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW5pZWxjYW1pbG8vRG9jdW1lbnRzL3N0dWRpZXMvcHJvamVjdHMvYXV0by1jYXJlLWxhbmRpbmcvYXBwL2FwaS9zdHJpcGUvd2ViaG9vay9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IFN0cmlwZSBmcm9tICdzdHJpcGUnO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICdAL2xpYi9zdXBhYmFzZSc7XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGFwaToge1xuICAgIGJvZHlQYXJzZXI6IGZhbHNlLFxuICB9LFxufTtcblxuY29uc3Qgc3RyaXBlID0gbmV3IFN0cmlwZShwcm9jZXNzLmVudi5TVFJJUEVfU0VDUkVUX0tFWSEpO1xuY29uc3Qgd2ViaG9va1NlY3JldCA9IHByb2Nlc3MuZW52LlNUUklQRV9XRUJIT09LX1NFQ1JFVCE7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc29sZS5sb2coJ+Keoe+4jyBSZWNlYmVuZG8gd2ViaG9vayBkYSBTdHJpcGUuLi4nKTtcblxuICB0cnkge1xuICAgIGNvbnN0IGJ1ZiA9IGF3YWl0IHJlcS5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IGJvZHkgPSBCdWZmZXIuZnJvbShidWYpO1xuICAgIGNvbnN0IHNpZyA9IHJlcS5oZWFkZXJzLmdldCgnc3RyaXBlLXNpZ25hdHVyZScpITtcblxuICAgIGNvbnN0IGV2ZW50ID0gc3RyaXBlLndlYmhvb2tzLmNvbnN0cnVjdEV2ZW50KGJvZHksIHNpZywgd2ViaG9va1NlY3JldCk7XG5cbiAgICBjb25zb2xlLmxvZygn8J+TpiBFdmVudG8gcmVjZWJpZG86JywgZXZlbnQudHlwZSk7XG5cbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2NoZWNrb3V0LnNlc3Npb24uY29tcGxldGVkJykge1xuICAgICAgY29uc3Qgc2Vzc2lvbiA9IGV2ZW50LmRhdGEub2JqZWN0IGFzIFN0cmlwZS5DaGVja291dC5TZXNzaW9uXG5cbiAgICAgIGNvbnNvbGUubG9nKCdTZXNzaW9uIHJlY2ViaWRhOicsIEpTT04uc3RyaW5naWZ5KHNlc3Npb24sIG51bGwsIDIpKVxuXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25JZCA9IHNlc3Npb24uc3Vic2NyaXB0aW9uO1xuXG4gICAgICBpZiAoIXN1YnNjcmlwdGlvbklkIHx8IHR5cGVvZiBzdWJzY3JpcHRpb25JZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcign4pqg77iPIFN1YnNjcmlwdGlvbiBJRCBuw6NvIGVuY29udHJhZG8gbmEgc2Vzc2lvbjonLCBzdWJzY3JpcHRpb25JZClcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdTdWJzY3JpcHRpb24gSUQgbsOjbyBlbmNvbnRyYWRvJyB9LCB7IHN0YXR1czogNDAwIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHN0cmlwZS5zdWJzY3JpcHRpb25zLnJldHJpZXZlKHN1YnNjcmlwdGlvbklkKTtcblxuICAgICAgY29uc3QgdXNlcklkID0gc3Vic2NyaXB0aW9uLm1ldGFkYXRhLnVzZXJfaWQ7XG5cbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oJ3N1YnNjcmlwdGlvbnMnKS5pbnNlcnQoW1xuICAgICAgICB7XG4gICAgICAgICAgdXNlcl9pZDogdXNlcklkLFxuICAgICAgICAgIHN0cmlwZV9jdXN0b21lcjogc3Vic2NyaXB0aW9uLmN1c3RvbWVyIGFzIHN0cmluZyxcbiAgICAgICAgICBzdHJpcGVfc3Vic2NyaXB0aW9uOiBzdWJzY3JpcHRpb24uaWQsXG4gICAgICAgICAgcHJpY2VfaWQ6IHN1YnNjcmlwdGlvbi5pdGVtcy5kYXRhWzBdLnByaWNlLmlkLFxuICAgICAgICAgIHN0YXR1czogc3Vic2NyaXB0aW9uLnN0YXR1cyxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJybyBhbyBpbnNlcmlyIG5vIFN1cGFiYXNlOicsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCfinIUgU3Vic2NyaXB0aW9uIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyByZWNlaXZlZDogdHJ1ZSB9KSwge1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcign4p2MIEVycm8gbm8gd2ViaG9vazonLCBlcnIubWVzc2FnZSk7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShgRXJybyBubyB3ZWJob29rOiAke2Vyci5tZXNzYWdlfWAsIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiU3RyaXBlIiwic3VwYWJhc2UiLCJjb25maWciLCJhcGkiLCJib2R5UGFyc2VyIiwic3RyaXBlIiwicHJvY2VzcyIsImVudiIsIlNUUklQRV9TRUNSRVRfS0VZIiwid2ViaG9va1NlY3JldCIsIlNUUklQRV9XRUJIT09LX1NFQ1JFVCIsIlBPU1QiLCJyZXEiLCJjb25zb2xlIiwibG9nIiwiYnVmIiwiYXJyYXlCdWZmZXIiLCJib2R5IiwiQnVmZmVyIiwiZnJvbSIsInNpZyIsImhlYWRlcnMiLCJnZXQiLCJldmVudCIsIndlYmhvb2tzIiwiY29uc3RydWN0RXZlbnQiLCJ0eXBlIiwic2Vzc2lvbiIsImRhdGEiLCJvYmplY3QiLCJKU09OIiwic3RyaW5naWZ5Iiwic3Vic2NyaXB0aW9uSWQiLCJzdWJzY3JpcHRpb24iLCJlcnJvciIsImpzb24iLCJzdGF0dXMiLCJzdWJzY3JpcHRpb25zIiwicmV0cmlldmUiLCJ1c2VySWQiLCJtZXRhZGF0YSIsInVzZXJfaWQiLCJpbnNlcnQiLCJzdHJpcGVfY3VzdG9tZXIiLCJjdXN0b21lciIsInN0cmlwZV9zdWJzY3JpcHRpb24iLCJpZCIsInByaWNlX2lkIiwiaXRlbXMiLCJwcmljZSIsIm1lc3NhZ2UiLCJFcnJvciIsIlJlc3BvbnNlIiwicmVjZWl2ZWQiLCJlcnIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/stripe/webhook/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsRUFBb0M7QUFDeEQsTUFBTUcseUJBQXlCSCxRQUFRQyxHQUFHLENBQUNHLHlCQUF5QjtBQUU3RCxNQUFNQyxXQUFXUCxtRUFBWUEsQ0FBQ0MsYUFBYUksd0JBQXdCIiwic291cmNlcyI6WyIvVXNlcnMvZGFuaWVsY2FtaWxvL0RvY3VtZW50cy9zdHVkaWVzL3Byb2plY3RzL2F1dG8tY2FyZS1sYW5kaW5nL2xpYi9zdXBhYmFzZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIVxuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXG5cbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSk7Il0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlU2VydmljZVJvbGVLZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwic3VwYWJhc2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstripe%2Fwebhook%2Froute&page=%2Fapi%2Fstripe%2Fwebhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstripe%2Fwebhook%2Froute.ts&appDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstripe%2Fwebhook%2Froute&page=%2Fapi%2Fstripe%2Fwebhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstripe%2Fwebhook%2Froute.ts&appDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_danielcamilo_Documents_studies_projects_auto_care_landing_app_api_stripe_webhook_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/stripe/webhook/route.ts */ \"(rsc)/./app/api/stripe/webhook/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/stripe/webhook/route\",\n        pathname: \"/api/stripe/webhook\",\n        filename: \"route\",\n        bundlePath: \"app/api/stripe/webhook/route\"\n    },\n    resolvedPagePath: \"/Users/danielcamilo/Documents/studies/projects/auto-care-landing/app/api/stripe/webhook/route.ts\",\n    nextConfigOutput,\n    userland: _Users_danielcamilo_Documents_studies_projects_auto_care_landing_app_api_stripe_webhook_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzdHJpcGUlMkZ3ZWJob29rJTJGcm91dGUmcGFnZT0lMkZhcGklMkZzdHJpcGUlMkZ3ZWJob29rJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGc3RyaXBlJTJGd2ViaG9vayUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmRhbmllbGNhbWlsbyUyRkRvY3VtZW50cyUyRnN0dWRpZXMlMkZwcm9qZWN0cyUyRmF1dG8tY2FyZS1sYW5kaW5nJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmRhbmllbGNhbWlsbyUyRkRvY3VtZW50cyUyRnN0dWRpZXMlMkZwcm9qZWN0cyUyRmF1dG8tY2FyZS1sYW5kaW5nJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNnRDtBQUM3SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2RhbmllbGNhbWlsby9Eb2N1bWVudHMvc3R1ZGllcy9wcm9qZWN0cy9hdXRvLWNhcmUtbGFuZGluZy9hcHAvYXBpL3N0cmlwZS93ZWJob29rL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9zdHJpcGUvd2ViaG9vay9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3N0cmlwZS93ZWJob29rXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9zdHJpcGUvd2ViaG9vay9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9kYW5pZWxjYW1pbG8vRG9jdW1lbnRzL3N0dWRpZXMvcHJvamVjdHMvYXV0by1jYXJlLWxhbmRpbmcvYXBwL2FwaS9zdHJpcGUvd2ViaG9vay9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstripe%2Fwebhook%2Froute&page=%2Fapi%2Fstripe%2Fwebhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstripe%2Fwebhook%2Froute.ts&appDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/stripe","vendor-chunks/@supabase","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/whatwg-url","vendor-chunks/qs","vendor-chunks/call-bind-apply-helpers","vendor-chunks/get-proto","vendor-chunks/tr46","vendor-chunks/object-inspect","vendor-chunks/has-symbols","vendor-chunks/gopd","vendor-chunks/function-bind","vendor-chunks/webidl-conversions","vendor-chunks/side-channel","vendor-chunks/side-channel-weakmap","vendor-chunks/side-channel-map","vendor-chunks/side-channel-list","vendor-chunks/hasown","vendor-chunks/get-intrinsic","vendor-chunks/es-object-atoms","vendor-chunks/es-define-property","vendor-chunks/dunder-proto","vendor-chunks/call-bound"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fstripe%2Fwebhook%2Froute&page=%2Fapi%2Fstripe%2Fwebhook%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fstripe%2Fwebhook%2Froute.ts&appDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdanielcamilo%2FDocuments%2Fstudies%2Fprojects%2Fauto-care-landing&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();