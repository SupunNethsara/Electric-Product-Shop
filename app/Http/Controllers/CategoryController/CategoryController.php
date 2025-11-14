<?php

namespace App\Http\Controllers\CategoryController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::with(['children.children'])
            ->mainCategories()
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function getActiveCategories()
    {
        $categories = Category::with(['children' => function($query) {
            $query->active()->with(['children' => function($query) {
                $query->active();
            }]);
        }])
            ->mainCategories()
            ->active()
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        if (isset($request[0]) && is_array($request[0])) {
            $validated = $request->validate([
                '*.name' => 'required',
                '*.description' => 'nullable|string',
                '*.parent_id' => 'nullable|exists:categories,id',
            ]);

            $created = [];

            foreach ($validated as $categoryData) {
                $level = 0;
                if (!empty($categoryData['parent_id'])) {
                    $parent = Category::find($categoryData['parent_id']);
                    $level = $parent->level + 1;
                }

                $categoryData['level'] = $level;
                $created[] = Category::create($categoryData);
            }

            return response()->json([
                'message' => 'Categories created successfully!',
                'data' => $created
            ], 201);
        }

        $validated = $request->validate([
            'name' => 'required',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $level = 0;
        if (!empty($validated['parent_id'])) {
            $parent = Category::find($validated['parent_id']);
            $level = $parent->level + 1;
        }

        $validated['level'] = $level;

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully!',
            'data' => $category
        ], 201);
    }

    public function getSubcategories($parentId)
    {
        $subcategories = Category::with('children')
            ->where('parent_id', $parentId)
            ->active()
            ->orderBy('name')
            ->get();

        return response()->json($subcategories);
    }

    public function update(Request $request, $id) {
        $category = Category::findOrFail($id);
        $category->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Category updated successfully!',
            'data' => $category
        ]);
    }
    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);

        $category->status = $category->status === 'active' ? 'disabled' : 'active';
        $category->save();

        return response()->json([
            'success' => true,
            'message' => 'Category status updated successfully!',
            'data' => $category
        ]);
    }

    public function destroy($id) {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Category deleted successfully!']);
    }
}

