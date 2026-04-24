<?php

namespace App\Http\Middleware;

use App\Infrastructure\Persistence\Eloquent\AgentModel;
use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use App\Infrastructure\Persistence\Eloquent\SaleModel;
use App\Infrastructure\Persistence\Eloquent\AppointmentModel;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'notifications' => fn () => $this->getRecentNotifications($request),
        ];
    }

    private function getRecentNotifications(Request $request): array
    {
        if (! $request->user()) {
            return [];
        }

        $agent = AgentModel::where('user_id', $request->user()->id)->first();
        if (! $agent) {
            return [];
        }

        $notifications = [];
        $since = now()->subDays(7);

        $recentBuyers = BuyerModel::where('agent_id', $agent->id)
            ->where('created_at', '>=', $since)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'buyer_type', 'created_at']);

        foreach ($recentBuyers as $buyer) {
            $notifications[] = [
                'id'         => 'client-' . $buyer->id,
                'type'       => 'client',
                'title'      => 'New Buyer',
                'message'    => $buyer->first_name . ' ' . $buyer->last_name . ' (' . $buyer->buyer_type . ')',
                'href'       => '/clients/' . $buyer->id,
                'created_at' => $buyer->created_at->toISOString(),
                'is_new'     => $buyer->created_at->gte(now()->subDay()),
            ];
        }

        $recentSales = SaleModel::where('agent_id', $agent->id)
            ->where('created_at', '>=', $since)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'status', 'total_contract_price', 'created_at']);

        foreach ($recentSales as $sale) {
            $notifications[] = [
                'id'         => 'sale-' . $sale->id,
                'type'       => 'sale',
                'title'      => 'New Sale',
                'message'    => 'Sale #' . $sale->id . ' — ' . $sale->status,
                'href'       => '/sales/' . $sale->id,
                'created_at' => $sale->created_at->toISOString(),
                'is_new'     => $sale->created_at->gte(now()->subDay()),
            ];
        }

        $recentAppointments = AppointmentModel::where('realty_id', $agent->realty_id ?? 0)
            ->where('created_at', '>=', $since)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'client_fname', 'client_lname', 'status', 'sched_date', 'created_at']);

        foreach ($recentAppointments as $appt) {
            $notifications[] = [
                'id'         => 'appt-' . $appt->id,
                'type'       => 'appointment',
                'title'      => 'New Appointment',
                'message'    => $appt->client_fname . ' ' . $appt->client_lname . ' — ' . $appt->status,
                'href'       => '/appointments',
                'created_at' => $appt->created_at->toISOString(),
                'is_new'     => $appt->created_at->gte(now()->subDay()),
            ];
        }

        usort($notifications, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return array_slice($notifications, 0, 10);
    }
}
