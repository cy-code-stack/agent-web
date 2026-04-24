<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Client\Contracts\BuyerRepository;
use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentBuyerRepository implements BuyerRepository
{
    public function findById(int $id): ?BuyerModel
    {
        return BuyerModel::with(['agent', 'sales'])->find($id);
    }

    public function findByAgent(
        int $agentId,
        ?string $search = null,
        int $perPage = 15,
        string $sortBy = 'created_at',
        string $order = 'desc',
    ): LengthAwarePaginator {
        $query = BuyerModel::where('agent_id', $agentId);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        $allowedSorts = ['first_name', 'last_name', 'created_at', 'email'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'created_at';
        $order = $order === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $order)->paginate($perPage);
    }

    public function save(BuyerModel $buyer): BuyerModel
    {
        $buyer->save();

        return $buyer;
    }

    public function update(int $id, array $data): BuyerModel
    {
        $buyer = BuyerModel::findOrFail($id);
        $buyer->update($data);

        return $buyer->fresh();
    }

    public function allForAgent(int $agentId): Collection
    {
        return BuyerModel::where('agent_id', $agentId)->get();
    }
}
