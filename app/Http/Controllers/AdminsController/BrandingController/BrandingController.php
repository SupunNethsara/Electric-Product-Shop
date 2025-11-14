<?php

namespace App\Http\Controllers\AdminsController\BrandingController;

use App\Http\Controllers\Controller;
use App\Models\Slide;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class BrandingController extends Controller
{
    public function index()
    {
        $slides = Slide::orderBy('order')->get();
        return response()->json($slides);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|string',
            'original_price' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'background_gradient' => 'nullable|string',
            'gradient_from' => 'nullable|string',
            'gradient_via' => 'nullable|string',
            'gradient_to' => 'nullable|string',
            'text_color' => 'nullable|string',
            'button_color' => 'nullable|string',
            'button_text_color' => 'nullable|string',
            'badge_text' => 'nullable|string',
            'badge_color' => 'nullable|string',
            'promotion_text' => 'nullable|string',
            'call_to_action' => 'nullable|string',
            'is_active' => 'sometimes',
            'order' => 'integer'
        ]);

        if (isset($validated['is_active'])) {
            $validated['is_active'] = $this->convertToBoolean($validated['is_active']);
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('slides', 'public');
            $validated['image'] = Storage::disk('public')->url($imagePath);
        }

        $slide = Slide::create($validated);
        return response()->json($slide, Response::HTTP_CREATED);
    }

    public function show(Slide $slide)
    {
        return response()->json($slide);
    }

    public function update(Request $request, Slide $slide)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|string',
            'original_price' => 'sometimes|required|string',
            'image' => 'sometimes|required',
            'background_gradient' => 'nullable|string',
            'gradient_from' => 'nullable|string',
            'gradient_via' => 'nullable|string',
            'gradient_to' => 'nullable|string',
            'text_color' => 'nullable|string',
            'button_color' => 'nullable|string',
            'button_text_color' => 'nullable|string',
            'badge_text' => 'nullable|string',
            'badge_color' => 'nullable|string',
            'promotion_text' => 'nullable|string',
            'call_to_action' => 'nullable|string',
            'is_active' => 'sometimes',
            'order' => 'integer'
        ]);

        if (isset($validated['is_active'])) {
            $validated['is_active'] = $this->convertToBoolean($validated['is_active']);
        }

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);
            if ($slide->image && Storage::disk('public')->exists(str_replace('/storage/', '', $slide->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $slide->image));
            }

            $imagePath = $request->file('image')->store('slides', 'public');
            $validated['image'] = Storage::disk('public')->url($imagePath);
        } else {
            $validated['image'] = $request->input('image');
        }

        $slide->update($validated);
        return response()->json($slide);
    }

    public function destroy(Slide $slide)
    {
        if ($slide->image && Storage::disk('public')->exists(str_replace('/storage/', '', $slide->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $slide->image));
        }

        $slide->delete();
        return response()->json(['message' => 'Slide deleted successfully']);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|exists:slides,id',
            'slides.*.order' => 'required|integer'
        ]);

        foreach ($request->slides as $slideData) {
            Slide::where('id', $slideData['id'])->update(['order' => $slideData['order']]);
        }

        return response()->json(['message' => 'Order updated successfully']);
    }

    public function toggleStatus(Slide $slide)
    {
        $slide->update(['is_active' => !$slide->is_active]);
        return response()->json($slide);
    }

    /**
     * Convert various boolean representations to actual boolean
     */
    private function convertToBoolean($value)
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            return $value === 'true' || $value === '1';
        }

        if (is_numeric($value)) {
            return (bool)$value;
        }

        return false;
    }
}
