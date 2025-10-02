<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class CustomerEmailVerificationController extends Controller
{
    public function verify(Request $request, string $id, string $hash): JsonResponse|RedirectResponse
    {
        $customer = Customer::find($id);

        if (! $customer) {
            return $this->respond($request, 'customer_not_found', 404);
        }

        if (! URL::hasValidSignature($request)) {
            return $this->respond($request, 'invalid_signature', 403);
        }

        if (! hash_equals((string) $hash, sha1($customer->getEmailForVerification()))) {
            return $this->respond($request, 'invalid_hash', 403);
        }

        if ($customer->hasVerifiedEmail()) {
            return $this->respond($request, 'already_verified');
        }

        $customer->markEmailAsVerified();

        event(new Verified($customer));

        return $this->respond($request, 'verified');
    }

    public function resend(Request $request): JsonResponse
    {
        /** @var \App\Models\Customer $customer */
        $customer = $request->user();

        if ($customer->hasVerifiedEmail()) {
            return response()->json([
                'status' => 'already_verified',
            ], 200);
        }

        $customer->sendEmailVerificationNotification();

        return response()->json([
            'status' => 'verification_link_sent',
        ]);
    }

    protected function respond(Request $request, string $status, int $statusCode = 200): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            $httpStatus = $status === 'verified' ? 200 : $statusCode;

            return response()->json(['status' => $status], $httpStatus);
        }

        $redirectUrl = $this->frontendRedirectUrl($request, $status);

        return redirect()->away($redirectUrl);
    }

    protected function frontendRedirectUrl(Request $request, string $status): string
    {
        $locale = $request->query('locale', config('app.locale'));
        $base = rtrim(config('app.frontend_url'), '/');

        return sprintf('%s/%s/login?verification=%s', $base, $locale, $status);
    }
}
