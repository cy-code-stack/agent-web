<?php

namespace App\Providers;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Domain\Appointment\Contracts\AppointmentRepository;
use App\Domain\Client\Contracts\BuyerRepository;
use App\Domain\Incentive\Contracts\IncentiveRepository;
use App\Domain\Sales\Contracts\SaleRepository;
use App\Infrastructure\Persistence\Eloquent\UserModel;
use App\Infrastructure\Persistence\Repositories\EloquentAgentRepository;
use App\Infrastructure\Persistence\Repositories\EloquentAppointmentRepository;
use App\Infrastructure\Persistence\Repositories\EloquentBuyerRepository;
use App\Infrastructure\Persistence\Repositories\EloquentIncentiveRepository;
use App\Infrastructure\Persistence\Repositories\EloquentSaleRepository;
use Illuminate\Support\ServiceProvider;

class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AgentRepository::class, EloquentAgentRepository::class);
        $this->app->bind(BuyerRepository::class, EloquentBuyerRepository::class);
        $this->app->bind(SaleRepository::class, EloquentSaleRepository::class);
        $this->app->bind(IncentiveRepository::class, EloquentIncentiveRepository::class);
        $this->app->bind(AppointmentRepository::class, EloquentAppointmentRepository::class);
    }

    public function boot(): void
    {
        // Point Laravel's auth system at our custom UserModel
        $this->app['config']->set('auth.providers.users.model', UserModel::class);
    }
}
