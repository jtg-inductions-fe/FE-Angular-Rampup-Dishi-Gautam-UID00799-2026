import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {
    provideRouter,
} from '@angular/router';

import { CreateArticleComponent } from './create-article.component';

describe('CreateArticleComponent', () => {
    let component: CreateArticleComponent;
    let fixture: ComponentFixture<CreateArticleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateArticleComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateArticleComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the article form', () => {
        expect(component['articleForm']).toBeTruthy();
    });

    it('should keep the form invalid when required fields are empty', () => {
        expect(component['articleForm'].invalid).toBeTrue();
    });

    it('should add a tag', () => {
        component['tagInput'] = 'angular';

        component.addTag();

        expect(component['articleForm'].controls.tags.value).toEqual([
            'angular',
        ]);
    });

    it('should not add duplicate tags', () => {
        component['tagInput'] = 'angular';

        component.addTag();
        component['tagInput'] = 'angular';
        component.addTag();

        expect(component['articleForm'].controls.tags.value).toEqual([
            'angular',
        ]);
    });

    it('should remove a tag', () => {
        component['articleForm'].controls.tags.setValue([
            'angular',
            'typescript',
        ]);

        component.removeTag('angular');

        expect(component['articleForm'].controls.tags.value).toEqual([
            'typescript',
        ]);
    });
});